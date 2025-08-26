package com.example.chatie.Chatie.dto.message;

import com.example.chatie.Chatie.entity.MessageType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MessageDTO {
    private Long id;
    private Long chatId;

    private Long senderId;
    private String senderUsername;

    private MessageType type;
    private String content;

    private Long replyToId;
    private String replyToPreview;   // small snippet

    private LocalDateTime createdAt;
    private LocalDateTime editedAt;
    private LocalDateTime deletedAt;

    private List<AttachmentDTO> attachments;
}
