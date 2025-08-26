package com.example.chatie.Chatie.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class ChatPinnedMessageId implements Serializable {
    private Long chatId;
    private Long messageId;
}
