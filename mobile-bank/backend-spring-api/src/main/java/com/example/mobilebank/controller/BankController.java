package com.example.mobilebank.controller;

import com.example.mobilebank.dto.BankDtos.*;
import com.example.mobilebank.security.AppPrincipal;
import com.example.mobilebank.service.BankService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bank")
public class BankController {
    private final BankService bankService;
    public BankController(BankService bankService) { this.bankService = bankService; }

    @GetMapping("/account")
    public AccountResponse account(@AuthenticationPrincipal AppPrincipal p) { return bankService.account(p.userId()); }
    @GetMapping("/transactions")
    public List<TransactionResponse> transactions(@AuthenticationPrincipal AppPrincipal p) { return bankService.transactions(p.userId()); }
    @GetMapping("/recent-recipients")
    public List<String> recentRecipients(@AuthenticationPrincipal AppPrincipal p) { return bankService.recentRecipients(p.userId()); }
    @PostMapping("/deposit")
    public BankResult deposit(@AuthenticationPrincipal AppPrincipal p, @RequestBody MoneyRequest r) { return bankService.deposit(p.userId(), r); }
    @PostMapping("/withdraw")
    public BankResult withdraw(@AuthenticationPrincipal AppPrincipal p, @RequestBody MoneyRequest r) { return bankService.withdraw(p.userId(), r); }
    @PostMapping("/transfer")
    public BankResult transfer(@AuthenticationPrincipal AppPrincipal p, @RequestBody TransferRequest r) { return bankService.transfer(p.userId(), r); }
    @PostMapping("/multi-transfer")
    public BankResult multiTransfer(@AuthenticationPrincipal AppPrincipal p, @RequestBody MultiTransferRequest r) { return bankService.multiTransfer(p.userId(), r); }
}
