package com.example.mobilebank.service;

import com.example.mobilebank.domain.*;
import com.example.mobilebank.dto.AdminDtos.*;
import com.example.mobilebank.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRecordRepository txRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisStateService redis;
    private final ObjectMapper objectMapper;

    public AdminService(UserRepository userRepository, AccountRepository accountRepository, TransactionRecordRepository txRepository, PasswordEncoder passwordEncoder, RedisStateService redis, ObjectMapper objectMapper) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.txRepository = txRepository;
        this.passwordEncoder = passwordEncoder;
        this.redis = redis;
        this.objectMapper = objectMapper;
    }

    public Object dashboard() {
        String cached = redis.getCachedDashboard();
        if (cached != null) {
            try { return objectMapper.readValue(cached, Object.class); } catch (Exception ignored) {}
        }
        var res = new DashboardResponse(
                userRepository.count(), accountRepository.count(), txRepository.count(),
                userRepository.findAll().stream().map(u -> Map.of("id", u.getId(), "username", u.getUsername(), "name", u.getName(), "role", u.getRole(), "status", u.getStatus())).toList(),
                accountRepository.findAll().stream().map(a -> Map.of("id", a.getId(), "userId", a.getUser().getId(), "accountNumber", a.getAccountNumber(), "balance", a.getBalance(), "status", a.getStatus())).toList(),
                txRepository.findTop50ByOrderByCreatedAtDesc().stream().map(t -> Map.of("id", t.getId(), "type", t.getType(), "amount", t.getAmount(), "fromAccountNumber", t.getFromAccountNumber() == null ? "" : t.getFromAccountNumber(), "toAccountNumber", t.getToAccountNumber() == null ? "" : t.getToAccountNumber(), "memo", t.getMemo() == null ? "" : t.getMemo(), "createdAt", t.getCreatedAt().toString())).toList(), redis.auditLogs()
        );
        try { redis.cacheDashboard(objectMapper.writeValueAsString(res)); } catch (Exception ignored) {}
        return res;
    }

    @Transactional
    public Object createUser(CreateUserRequest r) {
        if (userRepository.existsByUsername(r.username())) throw new IllegalArgumentException("USERNAME_ALREADY_EXISTS");
        UserRole role = "ADMIN".equalsIgnoreCase(r.role()) ? UserRole.ADMIN : UserRole.USER;
        User u = userRepository.save(new User(r.username(), passwordEncoder.encode(r.password()), r.name(), role));
        redis.evictDashboard(); redis.audit("ADMIN_CREATE_USER username=" + r.username());
        return Map.of("id", u.getId(), "username", u.getUsername(), "role", u.getRole());
    }

    @Transactional
    public Object changePassword(Long userId, PasswordChangeRequest r) {
        User u = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("USER_NOT_FOUND"));
        u.setPasswordHash(passwordEncoder.encode(r.password()));
        redis.audit("ADMIN_CHANGE_PASSWORD userId=" + userId);
        return Map.of("message", "비밀번호 변경 완료");
    }

    @Transactional
    public Object changeStatus(Long userId, StatusChangeRequest r) {
        User u = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("USER_NOT_FOUND"));
        u.setStatus("LOCKED".equalsIgnoreCase(r.status()) ? UserStatus.LOCKED : UserStatus.ACTIVE);
        redis.evictDashboard(); redis.audit("ADMIN_CHANGE_STATUS userId=" + userId + " status=" + u.getStatus());
        return Map.of("message", "상태 변경 완료", "status", u.getStatus());
    }

    @Transactional
    public Object createAccount(CreateAccountRequest r) {
        User u = userRepository.findById(r.userId()).orElseThrow(() -> new IllegalArgumentException("USER_NOT_FOUND"));
        Account a = accountRepository.save(new Account(u, "110-200-" + String.format("%06d", System.currentTimeMillis() % 1000000), r.initialBalance() == null ? BigDecimal.ZERO : r.initialBalance()));
        redis.evictDashboard(); redis.evictAccount(u.getId()); redis.audit("ADMIN_CREATE_ACCOUNT userId=" + u.getId());
        return Map.of("accountId", a.getId(), "accountNumber", a.getAccountNumber());
    }

    @Transactional
    public Object closeAccount(Long accountId) {
        Account a = accountRepository.findById(accountId).orElseThrow(() -> new IllegalArgumentException("ACCOUNT_NOT_FOUND"));
        a.close(); redis.evictDashboard(); redis.evictAccount(a.getUser().getId()); redis.audit("ADMIN_CLOSE_ACCOUNT accountId=" + accountId);
        return Map.of("message", "계좌 해지 완료");
    }
}
