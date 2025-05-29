package com.example.chatie.Chatie.controller;

import com.example.chatie.Chatie.dto.chat.ChatDTO;
import com.example.chatie.Chatie.dto.chat.ChatUpdateDTO;
import com.example.chatie.Chatie.dto.chat.CreateChatDTO;
import com.example.chatie.Chatie.exception.global.NotFoundException;
import com.example.chatie.Chatie.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // GET
    @GetMapping
    public ResponseEntity<List<ChatDTO>> getAllChats() {
        return ResponseEntity.ok(chatService.getAllChats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatDTO> getChatById(@PathVariable Long id) {
        return ResponseEntity.ok(chatService.getChatById(id));
    }

    @GetMapping("/by-title")
    public ResponseEntity<ChatDTO> getChatByTitle(@RequestParam String title) {
        return chatService.getChatByTitle(title)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new NotFoundException("Chat not found with title: " + title));
    }

    @GetMapping("/by-created-by-id")
    public ResponseEntity<List<ChatDTO>> getChatByCreatedById(@RequestParam Long id) {
        return ResponseEntity.ok(chatService.getChatsByCreatedById(id));
    }

    @GetMapping("/group")
    public ResponseEntity<List<ChatDTO>> getGroupChats() {
        return ResponseEntity.ok(chatService.getGroupChats());
    }

    @GetMapping("/private")
    public ResponseEntity<List<ChatDTO>> getPrivateChats() {
        return ResponseEntity.ok(chatService.getPrivateChats());
    }

    // POST
    @PostMapping
    public ResponseEntity<ChatDTO> createChat(@Valid @RequestBody CreateChatDTO dto) {
        return ResponseEntity.ok(chatService.createChat(dto));
    }

    // PUT
    @PutMapping("/{id}")
    public ResponseEntity<ChatDTO> updateChat(@PathVariable Long id, @Valid @RequestBody ChatUpdateDTO dto) {
        return ResponseEntity.ok(chatService.updateChat(id, dto));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChat(@PathVariable Long id) {
        chatService.deleteChatById(id);
        return ResponseEntity.noContent().build();
    }
}
