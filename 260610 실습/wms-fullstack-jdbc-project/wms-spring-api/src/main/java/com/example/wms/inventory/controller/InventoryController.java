package com.example.wms.inventory.controller;

import com.example.wms.common.ApiResponse;
import com.example.wms.inventory.dto.InventoryRequest;
import com.example.wms.inventory.dto.InventoryResponse;
import com.example.wms.inventory.service.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventories")
public class InventoryController {
    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<InventoryResponse>> findAll() {
        return ApiResponse.success(service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<InventoryResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(service.findById(id));
    }

    @PostMapping
    public ApiResponse<InventoryResponse> create(@RequestBody InventoryRequest request) {
        return ApiResponse.success("등록되었습니다.", service.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<InventoryResponse> update(@PathVariable Long id, @RequestBody InventoryRequest request) {
        return ApiResponse.success("수정되었습니다.", service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.message("삭제되었습니다.");
    }
}
