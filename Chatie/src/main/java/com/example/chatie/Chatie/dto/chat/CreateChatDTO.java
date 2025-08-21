package com.example.chatie.Chatie.dto.chat;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateChatDTO {
    @NotNull
    private Long userAId;
    @NotNull
    private Long userBId;
}
