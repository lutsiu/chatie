package com.example.chatie.Chatie.mapper;

import com.example.chatie.Chatie.dto.contact.ContactDTO;
import com.example.chatie.Chatie.dto.contact.ContactUpdateDTO;
import com.example.chatie.Chatie.entity.Contact;

public class ContactMapper {
    public static ContactDTO toDTO(Contact c) {
        return ContactDTO.builder()
                .id(c.getId())
                .email(c.getEmail())
                .firstName(c.getFirstName())
                .lastName(c.getLastName())
                .profilePictureUrl(
                        c.getContactUser() != null ? c.getContactUser().getProfilePictureUrl() : null
                )
                .build();
    }


    public static void applyUpdate(Contact c, ContactUpdateDTO dto) {
        if (dto.getFirstName() != null) c.setFirstName(dto.getFirstName().trim());
        if (dto.getLastName() != null) {
            String ln = dto.getLastName().trim();
            c.setLastName(ln.isEmpty() ? null : ln);
        }
    }
}
