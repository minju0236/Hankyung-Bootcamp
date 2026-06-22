package com.example.mobilebank.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Service
public class RedisStateService {
    private final StringRedisTemplate redis;

    public RedisStateService(StringRedisTemplate redis) { this.redis = redis; }

    public String createSession(Long userId, String username, String role) {
        String sessionId = UUID.randomUUID().toString();
        String key = "auth:session:" + sessionId;
        redis.opsForValue().set(key, userId + ":" + username + ":" + role, Duration.ofHours(1));
        redis.opsForList().leftPush("auth:user:" + userId + ":sessions", sessionId);
        redis.expire("auth:user:" + userId + ":sessions", Duration.ofHours(1));
        audit("LOGIN_SESSION_CREATED user=" + username + " session=" + sessionId);
        return sessionId;
    }

    public boolean sessionExists(String sessionId) {
        return sessionId != null && Boolean.TRUE.equals(redis.hasKey("auth:session:" + sessionId));
    }

    public void cacheAccount(Long userId, String json) {
        redis.opsForValue().set("cache:account:" + userId, json, Duration.ofSeconds(30));
    }

    public String getCachedAccount(Long userId) { return redis.opsForValue().get("cache:account:" + userId); }
    public void evictAccount(Long userId) { redis.delete("cache:account:" + userId); }

    public void cacheDashboard(String json) { redis.opsForValue().set("cache:admin:dashboard", json, Duration.ofSeconds(20)); }
    public String getCachedDashboard() { return redis.opsForValue().get("cache:admin:dashboard"); }
    public void evictDashboard() { redis.delete("cache:admin:dashboard"); }

    public void addRecentRecipient(Long userId, String accountNumber) {
        String key = "recent:recipients:" + userId;
        redis.opsForList().leftPush(key, accountNumber);
        redis.opsForList().trim(key, 0, 9);
        redis.expire(key, Duration.ofDays(7));
    }

    public List<String> recentRecipients(Long userId) {
        return redis.opsForList().range("recent:recipients:" + userId, 0, 9);
    }

    public void audit(String message) {
        redis.opsForList().leftPush("audit:logs", java.time.LocalDateTime.now() + " " + message);
        redis.opsForList().trim("audit:logs", 0, 199);
    }

    public List<String> auditLogs() { return redis.opsForList().range("audit:logs", 0, 50); }
}
