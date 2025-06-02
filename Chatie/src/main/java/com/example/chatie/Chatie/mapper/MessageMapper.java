package com.example.chatie.Chatie.mapper;

import com.example.chatie.Chatie.dto.message.CreatedMessageDTO;
import com.example.chatie.Chatie.dto.message.MessageDTO;
import com.example.chatie.Chatie.entity.Chat;
import com.example.chatie.Chatie.entity.Message;
import com.example.chatie.Chatie.entity.User;

public class MessageMapper {

    // Create DTO to entity
    public static Message toEntity(CreatedMessageDTO dto, User sender, Chat chat) {
        return Message.builder()
                .content(dto.getContent())
                .chat(chat)
                .sender(sender)
                .build();
    }

    // Entity to DTO
    public static MessageDTO toDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .chatId(message.getChat().getId())
                .senderId(message.getSender().getId())
                .senderUsername(message.getSender().getUsername())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
