package com.example.wms.common;

import java.time.LocalDateTime;

public record ErrorResponse(boolean ok, String message, int status, LocalDateTime timestamp) {
    public static ErrorResponse of(String message, int status) {
        return new ErrorResponse(false, message, status, LocalDateTime.now());
    }
}
