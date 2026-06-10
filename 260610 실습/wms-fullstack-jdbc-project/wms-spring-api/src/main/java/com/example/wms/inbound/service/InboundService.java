package com.example.wms.inbound.service;

import com.example.wms.inbound.dto.InboundRequest;
import com.example.wms.inbound.dto.InboundResponse;
import com.example.wms.inbound.model.Inbound;
import com.example.wms.inbound.repository.InboundRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InboundService {
    private final InboundRepository repository;

    public InboundService(InboundRepository repository) {
        this.repository = repository;
    }

    public List<InboundResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public InboundResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("데이터를 찾을 수 없습니다."));
    }

    public InboundResponse create(InboundRequest request) {
        validate(request);
        Inbound item = toModel(request);
        repository.save(item);
        return repository.findAll().stream().findFirst().map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("저장 결과를 찾을 수 없습니다."));
    }

    public InboundResponse update(Long id, InboundRequest request) {
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

    private void validate(InboundRequest request) {
        // 각 업무 화면에서 전달된 최소 입력값을 검증한다.
    }

    private Inbound toModel(InboundRequest request) {
        return new Inbound(null, request.contractId(), request.itemName(), request.quantity(), request.inboundStatus(), request.inboundDate(), null, null);
    }

    private InboundResponse toResponse(Inbound item) {
        return new InboundResponse(item.id(), item.contractId(), item.itemName(), item.quantity(), item.inboundStatus(), item.inboundDate(), item.createdAt(), item.updatedAt());
    }
}
