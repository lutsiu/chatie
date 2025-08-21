package com.example.chatie.Chatie.dto.auth;

import com.example.chatie.Chatie.dto.user.UserDTO;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UserDTO user;
}
