package com.example.wms.outbound.controller;

import com.example.wms.common.ApiResponse;
import com.example.wms.outbound.dto.OutboundRequest;
import com.example.wms.outbound.dto.OutboundResponse;
import com.example.wms.outbound.service.OutboundService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/outbounds")
public class OutboundController {
    private final OutboundService service;

    public OutboundController(OutboundService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<OutboundResponse>> findAll() {
        return ApiResponse.success(service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<OutboundResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(service.findById(id));
    }

    @PostMapping
    public ApiResponse<OutboundResponse> create(@RequestBody OutboundRequest request) {
        return ApiResponse.success("등록되었습니다.", service.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<OutboundResponse> update(@PathVariable Long id, @RequestBody OutboundRequest request) {
        return ApiResponse.success("수정되었습니다.", service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.message("삭제되었습니다.");
    }
}
