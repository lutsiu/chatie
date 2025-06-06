package com.example.chatie.Chatie.controller;

import com.example.chatie.Chatie.dto.chatparticipant.ChatParticipantDTO;
import com.example.chatie.Chatie.dto.chatparticipant.CreateChatParticipantDTO;
import com.example.chatie.Chatie.dto.chatparticipant.UpdateChatParticipantDTO;
import com.example.chatie.Chatie.service.chatparticipant.ChatParticipantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat-participants")
@RequiredArgsConstructor
public class ChatParticipantController {
    private final ChatParticipantService chatParticipantService;


    // CREATE
    @PostMapping
    public ResponseEntity<ChatParticipantDTO> createParticipant(@RequestBody
                                                                    CreateChatParticipantDTO dto) {
        ChatParticipantDTO created = chatParticipantService.createChatParticipant(dto);
        return ResponseEntity.ok(created);
    }

    // READ
    @GetMapping("/{id}")
    public ResponseEntity<ChatParticipantDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(chatParticipantService.getById(id));
    }

    @GetMapping("/by-chat/{chatId}")
    public ResponseEntity<List<ChatParticipantDTO>> getByChatId(@PathVariable Long chatId) {
        return ResponseEntity.ok(chatParticipantService.getByChatId(chatId));
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<List<ChatParticipantDTO>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(chatParticipantService.getByUserId(userId));
    }

    // UPDATE
    @PutMapping
    public ResponseEntity<ChatParticipantDTO> updateParticipant(@RequestBody
                                                                    UpdateChatParticipantDTO dto) {
        return ResponseEntity.ok(chatParticipantService.updateParticipant(dto));
    }

    // DELETE
    @DeleteMapping
    public ResponseEntity<Void> deleteParticipant(@RequestParam Long chatId,
                                                  @RequestParam Long userId) {
        chatParticipantService.deleteParticipant(chatId, userId);
        return ResponseEntity.noContent().build();
    }

    // CHECK
    @GetMapping("/check")
    public ResponseEntity<Boolean> isUserInChat(@RequestParam Long chatId,
                                                @RequestParam Long userId) {
        return ResponseEntity.ok(chatParticipantService.isUserInChat(chatId, userId));
    }
}
