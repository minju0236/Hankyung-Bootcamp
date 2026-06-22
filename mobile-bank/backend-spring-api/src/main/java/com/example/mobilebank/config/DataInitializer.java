package com.example.mobilebank.config;

import com.example.mobilebank.domain.*;
import com.example.mobilebank.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner init(UserRepository users, AccountRepository accounts, PasswordEncoder encoder) {
        return args -> {
            User admin = users.findByUsername("admin").orElseGet(() -> users.save(new User("admin", encoder.encode("admin123"), "관리자", UserRole.ADMIN)));
            User u1 = users.findByUsername("user1").orElseGet(() -> users.save(new User("user1", encoder.encode("1234"), "김사용", UserRole.USER)));
            User u2 = users.findByUsername("user2").orElseGet(() -> users.save(new User("user2", encoder.encode("1234"), "이수신", UserRole.USER)));
            User u3 = users.findByUsername("user3").orElseGet(() -> users.save(new User("user3", encoder.encode("1234"), "박고객", UserRole.USER)));
            seedAccount(accounts, admin, "999-000-000001", "10000000");
            seedAccount(accounts, u1, "110-100-000001", "1000000");
            seedAccount(accounts, u2, "110-100-000002", "800000");
            seedAccount(accounts, u3, "110-100-000003", "600000");
        };
    }
    private void seedAccount(AccountRepository accounts, User user, String number, String amount) {
        accounts.findByAccountNumber(number).orElseGet(() -> accounts.save(new Account(user, number, new BigDecimal(amount))));
    }
}
