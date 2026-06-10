package com.example.wms.outbound.service;

import com.example.wms.outbound.dto.OutboundRequest;
import com.example.wms.outbound.dto.OutboundResponse;
import com.example.wms.outbound.model.Outbound;
import com.example.wms.outbound.repository.OutboundRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OutboundService {
    private final OutboundRepository repository;

    public OutboundService(OutboundRepository repository) {
        this.repository = repository;
    }

    public List<OutboundResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public OutboundResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("데이터를 찾을 수 없습니다."));
    }

    public OutboundResponse create(OutboundRequest request) {
        validate(request);
        Outbound item = toModel(request);
        repository.save(item);
        return repository.findAll().stream().findFirst().map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("저장 결과를 찾을 수 없습니다."));
    }

    public OutboundResponse update(Long id, OutboundRequest request) {
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

    private void validate(OutboundRequest request) {
        // 각 업무 화면에서 전달된 최소 입력값을 검증한다.
    }

    private Outbound toModel(OutboundRequest request) {
        return new Outbound(null, request.itemName(), request.quantity(), request.outboundStatus(), request.receiverName(), request.outboundDate(), null, null);
    }

    private OutboundResponse toResponse(Outbound item) {
        return new OutboundResponse(item.id(), item.itemName(), item.quantity(), item.outboundStatus(), item.receiverName(), item.outboundDate(), item.createdAt(), item.updatedAt());
    }
}
