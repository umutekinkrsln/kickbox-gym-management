package com.kickboksapp.controller;

import com.kickboksapp.dto.AuthResponse;
import com.kickboksapp.dto.LoginRequest;
import com.kickboksapp.dto.RegisterRequest;
import com.kickboksapp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // NOT: Bu endpoint su an herkese acik. Ilk admin/antrenoru olusturduktan sonra
    // ileride bu endpoint'i sadece ADMIN rolune kapatmayi dusunebiliriz.
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
