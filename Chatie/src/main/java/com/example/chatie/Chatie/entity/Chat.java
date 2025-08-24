package com.example.chatie.Chatie.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "chat",
        uniqueConstraints = @UniqueConstraint(name = "uk_chat_user_pair", columnNames = {"user1_id", "user2_id"})
)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Normalize order in service: smaller ID in user1, larger in user2
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Fast list (avoid joining messages list)
    @Column(name = "last_message_id")
    private Long lastMessageId; // keep primitive id to avoid hard dependency on Message (for now)

    @Column(name = "last_message_at")
    private LocalDateTime lastMessageAt;

    @Column(name = "last_message_preview", length = 200)
    private String lastMessagePreview;

    // Per-participant read markers
    @Column(name = "user1_last_read_at")
    private LocalDateTime user1LastReadAt;

    @Column(name = "user2_last_read_at")
    private LocalDateTime user2LastReadAt;

    @PrePersist
    protected void onCreate() {
        final LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
