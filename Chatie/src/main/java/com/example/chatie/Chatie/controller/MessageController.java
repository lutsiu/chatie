// src/main/java/com/example/chatie/Chatie/controller/MessageController.java
package com.example.chatie.Chatie.controller;

import com.example.chatie.Chatie.dto.message.*;
import com.example.chatie.Chatie.service.message.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService service;

    // Create message (JSON with optional attachments URLs)
    @PostMapping
    public ResponseEntity<MessageDTO> create(@Valid @RequestBody CreateMessageDTO dto) {
        return ResponseEntity.ok(service.create(dto));
    }

    // Edit text/caption
    @PatchMapping("/{id}")
    public ResponseEntity<MessageDTO> edit(
            @PathVariable Long id,
            @RequestBody EditMessageDTO body) {
        return ResponseEntity.ok(service.edit(id, body));
    }

    // Soft delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.softDelete(id);
        return ResponseEntity.noContent().build();
    }

    // Page (newest first), beforeId for infinite scroll
    @GetMapping("/by-chat/{chatId}")
    public ResponseEntity<List<MessageDTO>> page(
            @PathVariable Long chatId,
            @RequestParam(required = false) Integer limit,
            @RequestParam(required = false) Long beforeId
    ) {
        return ResponseEntity.ok(service.page(chatId, limit, beforeId));
    }

    // Pinned
    @PostMapping("/pin")
    public ResponseEntity<Void> pin(
            @RequestParam Long chatId,
            @RequestParam Long messageId,
            @RequestParam Long userId    // until you wire /me
    ) {
        service.pin(chatId, messageId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/pin")
    public ResponseEntity<Void> unpin(
            @RequestParam Long chatId,
            @RequestParam Long messageId
    ) {
        service.unpin(chatId, messageId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pin/{chatId}")
    public ResponseEntity<List<MessageDTO>> listPinned(@PathVariable Long chatId) {
        return ResponseEntity.ok(service.listPinned(chatId));
    }
}
