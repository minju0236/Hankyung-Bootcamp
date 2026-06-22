package com.example.mobilebank.service;

import com.example.mobilebank.domain.*;
import com.example.mobilebank.dto.BankDtos.*;
import com.example.mobilebank.repository.AccountRepository;
import com.example.mobilebank.repository.TransactionRecordRepository;
import com.example.mobilebank.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BankService {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final TransactionRecordRepository txRepository;
    private final RedisStateService redis;
    private final ObjectMapper objectMapper;

    public BankService(AccountRepository accountRepository, UserRepository userRepository, TransactionRecordRepository txRepository, RedisStateService redis, ObjectMapper objectMapper) {
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
        this.txRepository = txRepository;
        this.redis = redis;
        this.objectMapper = objectMapper;
    }

    public AccountResponse account(Long userId) {
        String cached = redis.getCachedAccount(userId);
        if (cached != null) {
            try { return objectMapper.readValue(cached, AccountResponse.class); } catch (Exception ignored) {}
        }
        Account a = accountRepository.findByUserId(userId).stream().filter(x -> x.getStatus() == AccountStatus.ACTIVE).findFirst().orElseThrow(() -> new IllegalArgumentException("ACTIVE_ACCOUNT_NOT_FOUND"));
        AccountResponse res = toAccount(a);
        try { redis.cacheAccount(userId, objectMapper.writeValueAsString(res)); } catch (Exception ignored) {}
        return res;
    }

    public List<TransactionResponse> transactions(Long userId) {
        return txRepository.findTop30ByUserIdOrderByCreatedAtDesc(userId).stream().map(this::toTx).toList();
    }

    public List<String> recentRecipients(Long userId) { return redis.recentRecipients(userId); }

    @Transactional
    public BankResult deposit(Long userId, MoneyRequest r) {
        Account a = primaryLocked(userId);
        assertActive(a);
        a.deposit(r.amount());
        txRepository.save(new TransactionRecord(a.getUser(), TransactionType.DEPOSIT, r.amount(), null, a.getAccountNumber(), r.memo()));
        redis.evictAccount(userId); redis.evictDashboard(); redis.audit("DEPOSIT userId=" + userId + " amount=" + r.amount());
        return new BankResult("입금 완료", toAccount(a));
    }

    @Transactional
    public BankResult withdraw(Long userId, MoneyRequest r) {
        Account a = primaryLocked(userId);
        assertActive(a);
        ensureBalance(a, r.amount());
        a.withdraw(r.amount());
        txRepository.save(new TransactionRecord(a.getUser(), TransactionType.WITHDRAW, r.amount(), a.getAccountNumber(), null, r.memo()));
        redis.evictAccount(userId); redis.evictDashboard(); redis.audit("WITHDRAW userId=" + userId + " amount=" + r.amount());
        return new BankResult("출금 완료", toAccount(a));
    }

    @Transactional
    public BankResult transfer(Long userId, TransferRequest r) {
        Account from = primaryLocked(userId);
        Account to = accountRepository.findWithLockByAccountNumber(r.toAccountNumber()).orElseThrow(() -> new IllegalArgumentException("TO_ACCOUNT_NOT_FOUND"));
        doTransfer(from, to, r.amount(), r.memo());
        redis.addRecentRecipient(userId, to.getAccountNumber());
        redis.evictAccount(userId); redis.evictAccount(to.getUser().getId()); redis.evictDashboard();
        redis.audit("TRANSFER userId=" + userId + " to=" + to.getAccountNumber() + " amount=" + r.amount());
        return new BankResult("송금 완료", toAccount(from));
    }

    @Transactional
    public BankResult multiTransfer(Long userId, MultiTransferRequest r) {
        Account from = primaryLocked(userId);
        BigDecimal total = r.targets().stream().map(TransferTarget::amount).reduce(BigDecimal.ZERO, BigDecimal::add);
        ensureBalance(from, total);
        for (TransferTarget target : r.targets()) {
            Account to = accountRepository.findWithLockByAccountNumber(target.toAccountNumber()).orElseThrow(() -> new IllegalArgumentException("TO_ACCOUNT_NOT_FOUND: " + target.toAccountNumber()));
            doTransfer(from, to, target.amount(), r.memo());
            redis.addRecentRecipient(userId, to.getAccountNumber());
            redis.evictAccount(to.getUser().getId());
        }
        redis.evictAccount(userId); redis.evictDashboard(); redis.audit("MULTI_TRANSFER userId=" + userId + " count=" + r.targets().size() + " total=" + total);
        return new BankResult("다중 송금 완료", toAccount(from));
    }

    private void doTransfer(Account from, Account to, BigDecimal amount, String memo) {
        assertActive(from); assertActive(to); ensureBalance(from, amount);
        from.withdraw(amount); to.deposit(amount);
        txRepository.save(new TransactionRecord(from.getUser(), TransactionType.TRANSFER_OUT, amount, from.getAccountNumber(), to.getAccountNumber(), memo));
        txRepository.save(new TransactionRecord(to.getUser(), TransactionType.TRANSFER_IN, amount, from.getAccountNumber(), to.getAccountNumber(), memo));
    }

    private Account primaryLocked(Long userId) { return accountRepository.findFirstByUserIdAndStatusOrderByIdAsc(userId, AccountStatus.ACTIVE).orElseThrow(() -> new IllegalArgumentException("ACTIVE_ACCOUNT_NOT_FOUND")); }
    private void ensureBalance(Account a, BigDecimal amount) { if (a.getBalance().compareTo(amount) < 0) throw new IllegalArgumentException("INSUFFICIENT_BALANCE"); }
    private void assertActive(Account a) { if (a.getStatus() != AccountStatus.ACTIVE) throw new IllegalArgumentException("ACCOUNT_CLOSED"); }
    private AccountResponse toAccount(Account a) { return new AccountResponse(a.getId(), a.getAccountNumber(), a.getBalance(), a.getStatus().name()); }
    private TransactionResponse toTx(TransactionRecord t) { return new TransactionResponse(t.getId(), t.getType().name(), t.getAmount(), t.getFromAccountNumber(), t.getToAccountNumber(), t.getMemo(), t.getCreatedAt()); }
}
