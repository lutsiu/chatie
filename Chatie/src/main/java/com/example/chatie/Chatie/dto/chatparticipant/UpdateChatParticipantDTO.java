package com.example.chatie.Chatie.dto.chatparticipant;

import com.example.chatie.Chatie.util.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateChatParticipantDTO {

    private Long id;
    private Role role;

    private Boolean isMuted;
}
