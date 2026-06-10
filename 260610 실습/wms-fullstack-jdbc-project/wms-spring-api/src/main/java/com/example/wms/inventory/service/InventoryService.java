package com.example.wms.inventory.service;

import com.example.wms.inventory.dto.InventoryRequest;
import com.example.wms.inventory.dto.InventoryResponse;
import com.example.wms.inventory.model.Inventory;
import com.example.wms.inventory.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository repository;

    public InventoryService(InventoryRepository repository) {
        this.repository = repository;
    }

    public List<InventoryResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public InventoryResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("데이터를 찾을 수 없습니다."));
    }

    public InventoryResponse create(InventoryRequest request) {
        validate(request);
        Inventory item = toModel(request);
        repository.save(item);
        return repository.findAll().stream().findFirst().map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("저장 결과를 찾을 수 없습니다."));
    }

    public InventoryResponse update(Long id, InventoryRequest request) {
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

    private void validate(InventoryRequest request) {
        // 각 업무 화면에서 전달된 최소 입력값을 검증한다.
    }

    private Inventory toModel(InventoryRequest request) {
        return new Inventory(null, request.itemName(), request.warehouseName(), request.quantity(), request.safetyStock(), null, null);
    }

    private InventoryResponse toResponse(Inventory item) {
        return new InventoryResponse(item.id(), item.itemName(), item.warehouseName(), item.quantity(), item.safetyStock(), item.createdAt(), item.updatedAt());
    }
}
