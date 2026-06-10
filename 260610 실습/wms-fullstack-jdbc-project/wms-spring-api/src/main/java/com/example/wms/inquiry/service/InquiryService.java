package com.example.wms.inquiry.service;

import com.example.wms.inquiry.dto.InquiryRequest;
import com.example.wms.inquiry.dto.InquiryResponse;
import com.example.wms.inquiry.model.Inquiry;
import com.example.wms.inquiry.repository.InquiryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InquiryService {
    private final InquiryRepository repository;

    public InquiryService(InquiryRepository repository) {
        this.repository = repository;
    }

    public List<InquiryResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public InquiryResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("데이터를 찾을 수 없습니다."));
    }

    public InquiryResponse create(InquiryRequest request) {
        validate(request);
        Inquiry item = toModel(request);
        repository.save(item);
        return repository.findAll().stream().findFirst().map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("저장 결과를 찾을 수 없습니다."));
    }

    public InquiryResponse update(Long id, InquiryRequest request) {
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

    private void validate(InquiryRequest request) {
        // 각 업무 화면에서 전달된 최소 입력값을 검증한다.
    }

    private Inquiry toModel(InquiryRequest request) {
        return new Inquiry(null, request.title(), request.content(), request.status(), null, null);
    }

    private InquiryResponse toResponse(Inquiry item) {
        return new InquiryResponse(item.id(), item.title(), item.content(), item.status(), item.createdAt(), item.updatedAt());
    }
}
