package com.example.wms.auth.service;

import com.example.wms.auth.dto.AuthResponse;
import com.example.wms.auth.dto.LoginRequest;
import com.example.wms.auth.dto.SignupRequest;
import com.example.wms.security.JwtTokenProvider;
import com.example.wms.user.model.User;
import com.example.wms.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse signup(SignupRequest request) {
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        });
        String hash = passwordEncoder.encode(request.password());
        User user = new User(null, request.email(), hash, request.name(), "USER", "ACTIVE", null, null);
        userRepository.save(user);
        User saved = userRepository.findByEmail(request.email()).orElseThrow();
        String token = jwtTokenProvider.createToken(saved);
        return toAuthResponse(saved, token);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));
        if (!"ACTIVE".equals(user.status())) {
            throw new IllegalArgumentException("비활성 사용자입니다.");
        }
        if (!passwordEncoder.matches(request.password(), user.passwordHash())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        String token = jwtTokenProvider.createToken(user);
        return toAuthResponse(user, token);
    }

    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        return toAuthResponse(user, null);
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return new AuthResponse(user.id(), user.email(), user.name(), user.role(), token);
    }
}
