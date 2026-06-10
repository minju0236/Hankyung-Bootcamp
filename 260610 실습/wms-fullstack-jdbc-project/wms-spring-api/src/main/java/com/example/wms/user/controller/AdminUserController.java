package com.example.wms.user.controller;

import com.example.wms.common.ApiResponse;
import com.example.wms.user.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ApiResponse<List<Map<String, Object>>> findAllUsers() {
        return ApiResponse.success(userService.findAllUsers());
    }
}
