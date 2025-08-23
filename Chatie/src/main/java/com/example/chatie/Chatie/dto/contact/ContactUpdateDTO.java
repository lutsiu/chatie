package com.example.chatie.Chatie.dto.contact;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContactUpdateDTO {
    private String email;      // optional
    private String firstName;  // optional
    private String lastName;   // optional
}
