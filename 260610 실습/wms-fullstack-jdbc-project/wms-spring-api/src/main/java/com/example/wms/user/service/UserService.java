package com.example.wms.user.service;

import com.example.wms.user.model.User;
import com.example.wms.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<Map<String, Object>> findAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> Map.<String, Object>of(
                        "id", user.id(),
                        "email", user.email(),
                        "name", user.name(),
                        "role", user.role(),
                        "status", user.status(),
                        "createdAt", user.createdAt().toString()
                ))
                .toList();
    }
}
