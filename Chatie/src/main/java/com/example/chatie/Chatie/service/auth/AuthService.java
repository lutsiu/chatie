package com.example.chatie.Chatie.service.auth;

import com.example.chatie.Chatie.dto.auth.AuthResponse;
import com.example.chatie.Chatie.dto.auth.LoginRequest;
import com.example.chatie.Chatie.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest req);
    AuthResponse login(LoginRequest req);
    AuthResponse refresh(String refreshToken);
}
