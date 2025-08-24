package com.example.chatie.Chatie.service.contact;

import com.example.chatie.Chatie.dto.contact.*;
import com.example.chatie.Chatie.entity.Contact;
import com.example.chatie.Chatie.entity.User;
import com.example.chatie.Chatie.exception.global.NotFoundException;
import com.example.chatie.Chatie.mapper.ContactMapper;
import com.example.chatie.Chatie.repository.ContactRepository;
import com.example.chatie.Chatie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepository repo;
    private final UserRepository users;

    @Override
    @Transactional
    public ContactDTO create(Long ownerId, ContactCreateDTO dto) {
        final String email = dto.getEmail().trim().toLowerCase();

        if (repo.existsByOwnerIdAndEmailIgnoreCase(ownerId, email)) {
            throw new IllegalStateException("Contact with this email already exists.");
        }

        User owner = users.findById(ownerId)
                .orElseThrow(() -> new NotFoundException("Owner not found: " + ownerId));

        // email must belong to a registered user
        User target = users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("No registered user with email: " + dto.getEmail()));

        if (target.getId() == (owner.getId())) {
            throw new IllegalStateException("You cannot add yourself as a contact.");
        }

        Contact c = Contact.builder()
                .owner(owner)
                .email(email)
                .contactUser(target) // <-- link to the actual user
                .firstName(dto.getFirstName().trim())
                .lastName(dto.getLastName() == null || dto.getLastName().trim().isEmpty()
                        ? null
                        : dto.getLastName().trim())
                .build();

        return ContactMapper.toDTO(repo.save(c));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactDTO> list(Long ownerId, String q) {
        if (q != null && !q.trim().isEmpty()) {
            return repo.search(ownerId, q.trim())
                    .stream()
                    .map(ContactMapper::toDTO)
                    .toList();
        }
        return repo.findByOwnerIdOrderByFirstNameAsc(ownerId)
                .stream()
                .map(ContactMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional
    public ContactDTO update(Long ownerId, Long id, ContactUpdateDTO dto) {
        Contact c = repo.findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new NotFoundException("Contact not found"));

        if (dto.getEmail() != null) {
            String newEmail = dto.getEmail().trim().toLowerCase();

            // must refer to a registered user
            User target = users.findByEmailIgnoreCase(newEmail)
                    .orElseThrow(() -> new NotFoundException("No registered user with email: " + dto.getEmail()));

            if (!newEmail.equalsIgnoreCase(c.getEmail()) &&
                    repo.existsByOwnerIdAndEmailIgnoreCase(ownerId, newEmail)) {
                throw new IllegalStateException("Contact with this email already exists.");
            }

            if (target.getId() == (c.getOwner().getId())) {
                throw new IllegalStateException("You cannot add yourself as a contact.");
            }

            c.setEmail(newEmail);
            c.setContactUser(target);
        }

        ContactMapper.applyUpdate(c, dto);
        return ContactMapper.toDTO(repo.save(c));
    }

    @Override
    @Transactional
    public void delete(Long ownerId, Long id) {
        Contact c = repo.findByIdAndOwnerId(id, ownerId)
                .orElseThrow(() -> new NotFoundException("Contact not found"));
        repo.delete(c);
    }
}
