package com.example.chatie.Chatie.controller;

import com.example.chatie.Chatie.dto.chat.ChatDTO;
import com.example.chatie.Chatie.dto.chat.CreateChatDTO;
import com.example.chatie.Chatie.service.chat.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/{id}")
    public ResponseEntity<ChatDTO> getChat(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.getById(id));
    }

    // For now, pass userId as query param (until auth /me is wired)
    @GetMapping
    public ResponseEntity<List<ChatDTO>> listForUser(@RequestParam Long userId) {
        return ResponseEntity.ok(chatService.listForUser(userId));
    }

    @PostMapping
    public ResponseEntity<ChatDTO> getOrCreate(@Valid @RequestBody CreateChatDTO dto) {
        return ResponseEntity.ok(chatService.getOrCreate(dto.getUserAId(), dto.getUserBId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChat(@PathVariable Long id) {
        chatService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
