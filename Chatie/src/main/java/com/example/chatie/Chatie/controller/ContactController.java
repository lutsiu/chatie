package com.example.chatie.Chatie.controller;

import com.example.chatie.Chatie.dto.contact.*;
import com.example.chatie.Chatie.service.contact.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contacts;

    private Long me(Authentication auth) { return Long.parseLong(auth.getName()); }

    @PostMapping
    public ResponseEntity<ContactDTO> create(
            @Valid @RequestBody ContactCreateDTO body,
            Authentication auth) {
        System.out.println("curwa");
        return ResponseEntity.status(HttpStatus.CREATED).body(contacts.create(me(auth), body));
    }

    @GetMapping
    public ResponseEntity<List<ContactDTO>> list(
            @RequestParam(value = "q", required = false) String q,
            Authentication auth) {
        return ResponseEntity.ok(contacts.list(me(auth), q));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ContactDTO> update(
            @PathVariable Long id,
            @RequestBody ContactUpdateDTO body,
            Authentication auth) {
        return ResponseEntity.ok(contacts.update(me(auth), id, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        contacts.delete(me(auth), id);
        return ResponseEntity.noContent().build();
    }
}
