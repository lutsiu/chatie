package com.example.chatie.Chatie.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "chat_pinned_message",
        uniqueConstraints = @UniqueConstraint(columnNames = {"chat_id","message_id"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatPinnedMessage {

    @EmbeddedId
    private ChatPinnedMessageId id;

    @ManyToOne(fetch = FetchType.LAZY) @MapsId("chatId")
    @JoinColumn(name = "chat_id")
    private Chat chat;

    @ManyToOne(fetch = FetchType.LAZY) @MapsId("messageId")
    @JoinColumn(name = "message_id")
    private Message message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pinned_by", nullable = false)
    private User pinnedBy;

    @Column(nullable = false)
    private LocalDateTime pinnedAt;

    @PrePersist
    void onCreate(){ pinnedAt = LocalDateTime.now(); }
}
