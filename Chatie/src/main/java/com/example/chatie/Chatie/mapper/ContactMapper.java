package com.example.chatie.Chatie.mapper;

import com.example.chatie.Chatie.dto.contact.*;
import com.example.chatie.Chatie.entity.Contact;

public class ContactMapper {
    public static ContactDTO toDTO(Contact c) {
        return ContactDTO.builder()
                .id(c.getId())
                .email(c.getEmail())
                .firstName(c.getFirstName())
                .lastName(c.getLastName())
                .build();
    }

    public static void applyUpdate(Contact c, ContactUpdateDTO dto) {
        if (dto.getEmail() != null) c.setEmail(dto.getEmail().trim().toLowerCase());
        if (dto.getFirstName() != null) c.setFirstName(dto.getFirstName().trim());
        if (dto.getLastName() != null) c.setLastName(dto.getLastName().trim().isEmpty() ? null : dto.getLastName().trim());
    }
}
