package com.example.chatie.Chatie.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginRequest {
    @NotBlank private String identifier; // email or username
    @NotBlank private String password;
}
