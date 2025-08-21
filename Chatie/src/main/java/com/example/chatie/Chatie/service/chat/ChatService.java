package com.example.chatie.Chatie.service.chat;

import com.example.chatie.Chatie.dto.chat.ChatDTO;

import java.util.List;

public interface ChatService {
    ChatDTO getById(Long id);
    List<ChatDTO> listForUser(Long userId);
    ChatDTO getOrCreate(Long userAId, Long userBId);
    void deleteById(Long chatId);
}
