package com.example.wms.inbound.controller;

import com.example.wms.common.ApiResponse;
import com.example.wms.inbound.dto.InboundRequest;
import com.example.wms.inbound.dto.InboundResponse;
import com.example.wms.inbound.service.InboundService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inbounds")
public class InboundController {
    private final InboundService service;

    public InboundController(InboundService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<InboundResponse>> findAll() {
        return ApiResponse.success(service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<InboundResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(service.findById(id));
    }

    @PostMapping
    public ApiResponse<InboundResponse> create(@RequestBody InboundRequest request) {
        return ApiResponse.success("등록되었습니다.", service.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<InboundResponse> update(@PathVariable Long id, @RequestBody InboundRequest request) {
        return ApiResponse.success("수정되었습니다.", service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.message("삭제되었습니다.");
    }
}
