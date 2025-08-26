package com.example.chatie.Chatie.dto.message;

import com.example.chatie.Chatie.entity.MessageType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateMessageDTO {
    @NotNull private Long chatId;
    @NotNull private Long senderId;

    @NotNull private MessageType type;
    private String content;       // optional for non-TEXT

    private Long replyToId;       // optional
    private List<AttachmentInputDTO> attachments; // optional (max 5 for mosaic)
}
