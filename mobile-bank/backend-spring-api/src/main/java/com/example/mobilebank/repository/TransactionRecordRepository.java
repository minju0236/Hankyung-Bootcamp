package com.example.mobilebank.repository;

import com.example.mobilebank.domain.TransactionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRecordRepository extends JpaRepository<TransactionRecord, Long> {
    List<TransactionRecord> findTop30ByUserIdOrderByCreatedAtDesc(Long userId);
    List<TransactionRecord> findTop50ByOrderByCreatedAtDesc();
}
