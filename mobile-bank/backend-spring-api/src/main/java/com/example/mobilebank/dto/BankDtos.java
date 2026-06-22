package com.example.mobilebank.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class BankDtos {
    public record MoneyRequest(BigDecimal amount, String memo) {}
    public record TransferRequest(String toAccountNumber, BigDecimal amount, String memo) {}
    public record MultiTransferRequest(List<TransferTarget> targets, String memo) {}
    public record TransferTarget(String toAccountNumber, BigDecimal amount) {}
    public record AccountResponse(Long accountId, String accountNumber, BigDecimal balance, String status) {}
    public record TransactionResponse(Long id, String type, BigDecimal amount, String fromAccountNumber, String toAccountNumber, String memo, LocalDateTime createdAt) {}
    public record BankResult(String message, AccountResponse account) {}
}
