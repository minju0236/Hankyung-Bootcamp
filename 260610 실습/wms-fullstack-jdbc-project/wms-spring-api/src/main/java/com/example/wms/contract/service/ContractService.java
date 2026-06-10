package com.example.wms.contract.service;

import com.example.wms.contract.dto.ContractRequest;
import com.example.wms.contract.dto.ContractResponse;
import com.example.wms.contract.model.Contract;
import com.example.wms.contract.repository.ContractRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContractService {
    private final ContractRepository repository;

    public ContractService(ContractRepository repository) {
        this.repository = repository;
    }

    public List<ContractResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public ContractResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("데이터를 찾을 수 없습니다."));
    }

    public ContractResponse create(ContractRequest request) {
        validate(request);
        Contract item = toModel(request);
        repository.save(item);
        return repository.findAll().stream().findFirst().map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("저장 결과를 찾을 수 없습니다."));
    }

    public ContractResponse update(Long id, ContractRequest request) {
        validate(request);
        repository.findById(id).orElseThrow(() -> new IllegalArgumentException("데이터를 찾을 수 없습니다."));
        int updated = repository.update(id, toModel(request));
        if (updated == 0) {
            throw new IllegalArgumentException("수정된 데이터가 없습니다.");
        }
        return findById(id);
    }

    public void delete(Long id) {
        repository.findById(id).orElseThrow(() -> new IllegalArgumentException("데이터를 찾을 수 없습니다."));
        repository.deleteById(id);
    }

    private void validate(ContractRequest request) {
        // 각 업무 화면에서 전달된 최소 입력값을 검증한다.
    }

    private Contract toModel(ContractRequest request) {
        return new Contract(null, request.customerName(), request.itemName(), request.quantity(), request.warehouseName(), request.contractStatus(), request.requestNote(), null, null);
    }

    private ContractResponse toResponse(Contract item) {
        return new ContractResponse(item.id(), item.customerName(), item.itemName(), item.quantity(), item.warehouseName(), item.contractStatus(), item.requestNote(), item.createdAt(), item.updatedAt());
    }
}
