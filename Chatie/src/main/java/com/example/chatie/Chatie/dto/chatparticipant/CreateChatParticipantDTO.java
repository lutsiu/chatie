package com.example.chatie.Chatie.dto.chatparticipant;

import com.example.chatie.Chatie.util.Role;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateChatParticipantDTO {

    @NotNull(message = "Chat ID must be provided")
    private Long chatId;

    @NotNull(message = "User ID must be provided")
    private Long userId;

    @NotNull(message = "Role must be specified")
    private Role role; // admin or member
}
