package com.example.wms.common;

public record ApiResponse<T>(boolean ok, String message, T data) {
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "success", data);
    }
    public static ApiResponse<Void> message(String message) {
        return new ApiResponse<>(true, message, null);
    }
}
