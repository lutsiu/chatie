package com.example.chatie.Chatie.dto.chat;

import lombok.*;

import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatDTO {
    private Long id;

    private Long user1Id;
    private String user1Username;

    private Long user2Id;
    private String user2Username;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
