package com.example.wms.inquiry.controller;

import com.example.wms.common.ApiResponse;
import com.example.wms.inquiry.dto.InquiryRequest;
import com.example.wms.inquiry.dto.InquiryResponse;
import com.example.wms.inquiry.service.InquiryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {
    private final InquiryService service;

    public InquiryController(InquiryService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<InquiryResponse>> findAll() {
        return ApiResponse.success(service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<InquiryResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(service.findById(id));
    }

    @PostMapping
    public ApiResponse<InquiryResponse> create(@RequestBody InquiryRequest request) {
        return ApiResponse.success("등록되었습니다.", service.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<InquiryResponse> update(@PathVariable Long id, @RequestBody InquiryRequest request) {
        return ApiResponse.success("수정되었습니다.", service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ApiResponse.message("삭제되었습니다.");
    }
}
