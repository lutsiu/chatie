// src/main/java/com/example/chatie/Chatie/mapper/MessageMapper.java
package com.example.chatie.Chatie.mapper;

import com.example.chatie.Chatie.dto.message.*;
import com.example.chatie.Chatie.entity.*;

import java.util.Comparator;

public class MessageMapper {

    public static Message toEntity(CreateMessageDTO dto, User sender, Chat chat, Message replyTo) {
        return Message.builder()
                .chat(chat)
                .sender(sender)
                .type(dto.getType())
                .content(dto.getContent())
                .replyTo(replyTo)
                .build();
    }

    public static AttachmentDTO toDTO(MessageAttachment a) {
        return AttachmentDTO.builder()
                .id(a.getId())
                .url(a.getUrl())
                .mime(a.getMime())
                .sizeBytes(a.getSizeBytes())
                .width(a.getWidth())
                .height(a.getHeight())
                .durationSec(a.getDurationSec())
                .originalName(a.getOriginalName())
                .position(a.getPosition())
                .build();
    }

    public static MessageDTO toDTO(Message m) {
        var dto = MessageDTO.builder()
                .id(m.getId())
                .chatId(m.getChat().getId())
                .senderId(m.getSender().getId())
                .senderUsername(m.getSender().getUsername())
                .type(m.getType())
                .content(m.getContent())
                .createdAt(m.getCreatedAt())
                .editedAt(m.getEditedAt())
                .deletedAt(m.getDeletedAt())
                .build();

        if (m.getReplyTo() != null) {
            dto.setReplyToId(m.getReplyTo().getId());
            dto.setReplyToPreview(buildPreview(m.getReplyTo()));
        }

        dto.setAttachments(
                m.getAttachments().stream()
                        .sorted(Comparator.comparingInt(MessageAttachment::getPosition))
                        .map(MessageMapper::toDTO).toList()
        );

        return dto;
    }

    public static String buildPreview(Message m) {
        if (m.getType() == MessageType.TEXT && m.getContent() != null) {
            var text = m.getContent().trim();
            return text.length() > 160 ? text.substring(0, 160) : text;
        }
        return switch (m.getType()) {
            case IMAGE -> "[Photo]";
            case VIDEO -> "[Video]";
            case FILE  -> "[File]";
            case SYSTEM -> "[System]";
            default -> "[Message]";
        };
    }
}
