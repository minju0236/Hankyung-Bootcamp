package com.example.mobilebank.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class JwtService {
    private final String secret;
    private final long expirationSeconds;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-seconds}") long expirationSeconds) {
        this.secret = secret;
        this.expirationSeconds = expirationSeconds;
    }

    public String createToken(Long userId, String username, String role, String sessionId) {
        try {
            Map<String, Object> header = Map.of("alg", "HS256", "typ", "JWT");
            long now = Instant.now().getEpochSecond();
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("sub", username);
            payload.put("userId", userId);
            payload.put("role", role);
            payload.put("sessionId", sessionId);
            payload.put("iat", now);
            payload.put("exp", now + expirationSeconds);

            String headerPart = base64Url(objectMapper.writeValueAsBytes(header));
            String payloadPart = base64Url(objectMapper.writeValueAsBytes(payload));
            String signingInput = headerPart + "." + payloadPart;
            String signature = sign(signingInput);
            return signingInput + "." + signature;
        } catch (Exception e) {
            throw new IllegalStateException("JWT_CREATE_FAILED", e);
        }
    }

    public AppPrincipal parse(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3) throw new IllegalArgumentException("INVALID_TOKEN");
            String signingInput = parts[0] + "." + parts[1];
            if (!sign(signingInput).equals(parts[2])) throw new IllegalArgumentException("INVALID_SIGNATURE");

            byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
            Map<?, ?> payload = objectMapper.readValue(decoded, Map.class);
            Number exp = (Number) payload.get("exp");
            if (exp.longValue() < Instant.now().getEpochSecond()) throw new IllegalArgumentException("TOKEN_EXPIRED");

            Long userId = ((Number) payload.get("userId")).longValue();
            String username = (String) payload.get("sub");
            String role = (String) payload.get("role");
            String sessionId = (String) payload.get("sessionId");
            return new AppPrincipal(userId, username, role, sessionId);
        } catch (Exception e) {
            throw new IllegalArgumentException("INVALID_TOKEN", e);
        }
    }

    private String sign(String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return base64Url(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
    }

    private String base64Url(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
