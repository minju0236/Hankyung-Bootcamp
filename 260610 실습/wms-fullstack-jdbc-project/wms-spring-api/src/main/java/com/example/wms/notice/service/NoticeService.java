package com.example.wms.notice.service;

import com.example.wms.notice.dto.NoticeRequest;
import com.example.wms.notice.dto.NoticeResponse;
import com.example.wms.notice.model.Notice;
import com.example.wms.notice.repository.NoticeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {
    private final NoticeRepository repository;

    public NoticeService(NoticeRepository repository) {
        this.repository = repository;
    }

    public List<NoticeResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public NoticeResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("데이터를 찾을 수 없습니다."));
    }

    public NoticeResponse create(NoticeRequest request) {
        validate(request);
        Notice item = toModel(request);
        repository.save(item);
        return repository.findAll().stream().findFirst().map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("저장 결과를 찾을 수 없습니다."));
    }

    public NoticeResponse update(Long id, NoticeRequest request) {
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

    private void validate(NoticeRequest request) {
        // 각 업무 화면에서 전달된 최소 입력값을 검증한다.
    }

    private Notice toModel(NoticeRequest request) {
        return new Notice(null, request.title(), request.content(), null, null);
    }

    private NoticeResponse toResponse(Notice item) {
        return new NoticeResponse(item.id(), item.title(), item.content(), item.createdAt(), item.updatedAt());
    }
}
