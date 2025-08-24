package com.example.chatie.Chatie.dto.contact;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;

    /** Derived from contactUser.profilePictureUrl */
    private String profilePictureUrl;
}
