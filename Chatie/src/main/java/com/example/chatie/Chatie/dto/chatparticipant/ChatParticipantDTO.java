package com.example.chatie.Chatie.dto.chatparticipant;

import com.example.chatie.Chatie.util.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class ChatParticipantDTO {
    private Long id;
    private Long chatId;
    private Long userId;
    private String username;
    private LocalDateTime joinedAt;
    private Role role;
    private boolean isMuted;
}
