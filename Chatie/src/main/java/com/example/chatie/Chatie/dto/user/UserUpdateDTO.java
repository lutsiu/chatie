package com.example.chatie.Chatie.dto.user;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserUpdateDTO {
    @Email(message = "Invalid email format")
    private String email;

    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;

    private String firstName;
    private String lastName;

    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    private String profilePictureUrl;
    @Size(max = 140, message = "About must be up to 140 characters")
    private String about;
}

