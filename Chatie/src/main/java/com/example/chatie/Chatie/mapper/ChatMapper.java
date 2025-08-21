package com.example.chatie.Chatie.mapper;

import com.example.chatie.Chatie.dto.chat.ChatDTO;
import com.example.chatie.Chatie.dto.chat.CreateChatDTO;
import com.example.chatie.Chatie.entity.Chat;
import com.example.chatie.Chatie.entity.User;

public class ChatMapper {

    public static ChatDTO toDTO(Chat c) {
        return ChatDTO.builder()
                .id(c.getId())
                .user1Id(c.getUser1().getId())
                .user1Username(c.getUser1().getUsername())
                .user2Id(c.getUser2().getId())
                .user2Username(c.getUser2().getUsername())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }

    public static Chat toEntity(User u1, User u2) {
        return Chat.builder()
                .user1(u1)
                .user2(u2)
                .build();
    }

}
