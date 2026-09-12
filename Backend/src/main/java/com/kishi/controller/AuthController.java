package com.kishi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kishi.dto.AuthRequest;
import com.kishi.dto.AuthResponse;
import com.kishi.service.AuthService;

import jakarta.validation.Valid;

@RestController 
@RequestMapping ("/api/auth")
public class AuthController {

    private final AuthService authService;
    
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping ("/register")
    public ResponseEntity<AuthResponse> register(
        @Valid  @RequestBody AuthRequest request) {

            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
    }   
    
}