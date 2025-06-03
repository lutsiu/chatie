package com.example.chatie.Chatie.mapper;


import com.example.chatie.Chatie.dto.chatparticipant.ChatParticipantDTO;
import com.example.chatie.Chatie.dto.chatparticipant.CreateChatParticipantDTO;
import com.example.chatie.Chatie.dto.chatparticipant.UpdateChatParticipantDTO;
import com.example.chatie.Chatie.entity.Chat;
import com.example.chatie.Chatie.entity.ChatParticipant;
import com.example.chatie.Chatie.entity.User;

public class ChatParticipantMapper {
    public static ChatParticipant toEntity(CreateChatParticipantDTO dto, Chat chat, User user) {
        return ChatParticipant.builder()
                .chat(chat)
                .user(user)
                .role(dto.getRole())
                .isMuted(false) // default
                .build();
    }

    public static void updateFromDTO(ChatParticipant participant, UpdateChatParticipantDTO dto) {
        if (dto.getRole() != null) {
            participant.setRole(dto.getRole());
        }
        if (dto.getIsMuted() != null) {
            participant.setMuted(dto.getIsMuted());
        }
    }

    public static ChatParticipantDTO toDTO(ChatParticipant participant) {
        return ChatParticipantDTO.builder()
                .id(participant.getId())
                .chatId(participant.getChat().getId())
                .userId(participant.getUser().getId())
                .username(participant.getUser().getUsername())
                .role(participant.getRole())
                .isMuted(participant.isMuted())
                .joinedAt(participant.getJoinedAt())
                .build();
    }
}
