package com.example.chatie.Chatie.controller;

import com.example.chatie.Chatie.dto.message.CreateMessageDTO;
import com.example.chatie.Chatie.dto.message.MessageDTO;
import com.example.chatie.Chatie.exception.global.NotFoundException;
import com.example.chatie.Chatie.service.message.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    // CREATE
    @PostMapping
    public ResponseEntity<MessageDTO> createMessage(@RequestBody CreateMessageDTO dto) {
        return ResponseEntity.ok(messageService.createMessage(dto));
    }

    // READ
    @GetMapping("/{id}")
    public ResponseEntity<MessageDTO> getMessageById(@PathVariable Long id) {
        return ResponseEntity.ok(messageService.getMessageById(id));
    }

    @GetMapping("/by-chat")
    public ResponseEntity<List<MessageDTO>> getMessagesByChatId(@RequestParam Long chatId) {
        return ResponseEntity.ok(messageService.getMessagesByChatId(chatId));
    }

    @GetMapping("/by-sender")
    public ResponseEntity<List<MessageDTO>> getMessagesBySenderId(@RequestParam Long senderId) {
        return ResponseEntity.ok(messageService.getMessagesBySenderId(senderId));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable Long id) {
        messageService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
