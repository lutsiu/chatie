package com.example.chatie.Chatie.service.contact;

import com.example.chatie.Chatie.dto.contact.*;
import java.util.List;

public interface ContactService {
    ContactDTO create(Long ownerId, ContactCreateDTO dto);
    List<ContactDTO> list(Long ownerId, String q);
    ContactDTO update(Long ownerId, Long id, ContactUpdateDTO dto);
    void delete(Long ownerId, Long id);
}
