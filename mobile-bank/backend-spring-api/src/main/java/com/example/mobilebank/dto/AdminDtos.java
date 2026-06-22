package com.example.mobilebank.dto;

import java.math.BigDecimal;
import java.util.List;

public class AdminDtos {
    public record CreateUserRequest(String username, String password, String name, String role) {}
    public record PasswordChangeRequest(String password) {}
    public record StatusChangeRequest(String status) {}
    public record CreateAccountRequest(Long userId, BigDecimal initialBalance) {}
    public record AdminMoneyRequest(String accountNumber, BigDecimal amount, String memo) {}
    public record DashboardResponse(long userCount, long accountCount, long transactionCount, List<?> users, List<?> accounts, List<?> transactions, List<String> auditLogs) {}
}
