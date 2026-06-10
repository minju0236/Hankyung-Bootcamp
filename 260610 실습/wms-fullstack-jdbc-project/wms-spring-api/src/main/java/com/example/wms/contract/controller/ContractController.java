package com.example.wms.contract.controller;

import com.example.wms.common.ApiResponse;
import com.example.wms.contract.dto.ContractRequest;
import com.example.wms.contract.dto.ContractResponse;
import com.example.wms.contract.service.ContractService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
public class ContractController {
    private final ContractService service;

    public ContractController(ContractService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<ContractResponse>> findAll() {
        return ApiResponse.success(service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<ContractResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(service.findById(id));
    }

    @PostMapping
    public ApiResponse<ContractResponse> create(@RequestBody ContractRequest request) {
        return ApiResponse.success("등록되었습니다.", service.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<ContractResponse> update(@PathVariable Long id, @RequestBody ContractRequest request) {
        return ApiResponse.success("수정되었습니다.", service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.message("삭제되었습니다.");
    }
}
