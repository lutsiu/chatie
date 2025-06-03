package com.example.chatie.Chatie.entity;

import com.example.chatie.Chatie.util.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_participant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "role")
    private Role role;

    @Column(nullable = false)
    private boolean isMuted = false;

    @Column(name = "joined_at", updatable = false, nullable = false)
    private LocalDateTime joinedAt;

    @PrePersist
    private void onJoin() {
        this.joinedAt = LocalDateTime.now();
    }


}
