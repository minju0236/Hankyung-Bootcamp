package com.example.mobilebank.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts", indexes = {
        @Index(name = "idx_accounts_number", columnList = "accountNumber", unique = true),
        @Index(name = "idx_accounts_user", columnList = "user_id")
})
public class Account {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User user;

    @Column(nullable = false, unique = true, length = 30)
    private String accountNumber;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AccountStatus status;

    @Version
    private Long version;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    protected Account() {}

    public Account(User user, String accountNumber, BigDecimal balance) {
        this.user = user;
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.status = AccountStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getAccountNumber() { return accountNumber; }
    public BigDecimal getBalance() { return balance; }
    public AccountStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void deposit(BigDecimal amount) { this.balance = this.balance.add(amount); }
    public void withdraw(BigDecimal amount) { this.balance = this.balance.subtract(amount); }
    public void close() { this.status = AccountStatus.CLOSED; }
}
