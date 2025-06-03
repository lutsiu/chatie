package com.example.chatie.Chatie.mapper;

import com.example.chatie.Chatie.dto.chat.ChatDTO;
import com.example.chatie.Chatie.dto.chat.ChatUpdateDTO;
import com.example.chatie.Chatie.dto.chat.CreateChatDTO;
import com.example.chatie.Chatie.entity.Chat;
import com.example.chatie.Chatie.entity.User;

public class ChatMapper {
    public static ChatDTO toDTO(Chat chat) {
        return ChatDTO.builder()
                .id(chat.getId())
                .title(chat.getTitle())
                .isGroup(chat.isGroup())
                .createdById(chat.getCreatedBy().getId())
                .createdByUsername(chat.getCreatedBy().getUsername())
                .imageUrl(chat.getImageUrl())
                .build();
    }
    public static Chat toEntity(CreateChatDTO dto, User user) {
        return Chat.builder()
                .title(dto.getTitle())
                .createdBy(user)
                .isGroup(dto.isGroup())
                .imageUrl(dto.getImageUrl())
                .build();
    }
    public static void updateChatFromDTO(Chat chat, ChatUpdateDTO dto) {
        if (dto.getTitle() != null && !dto.getTitle().trim().isEmpty()) {
            chat.setTitle(dto.getTitle().trim());
        }
        if (dto.getImageUrl() != null && !dto.getImageUrl().trim().isEmpty()) {
            chat.setImageUrl(dto.getImageUrl().trim());
        }
    }
}
