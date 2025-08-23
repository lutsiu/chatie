package com.example.chatie.Chatie.dto.contact;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContactCreateDTO {
    @Email @NotBlank
    private String email;

    @NotBlank
    private String firstName;

    private String lastName; // optional
}
