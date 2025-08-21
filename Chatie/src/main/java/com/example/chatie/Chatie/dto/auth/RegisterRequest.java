package com.example.chatie.Chatie.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RegisterRequest {
    @Email @NotBlank private String email;
    @NotBlank @Size(min = 3, max = 50) private String username;
    @NotBlank @Size(min = 8) private String password;
    @NotBlank private String firstName;
    private String lastName;
}
