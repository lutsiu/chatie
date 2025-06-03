package com.example.chatie.Chatie.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CreateChatDTO {
    private String title;
    private boolean isGroup;
    private Long createdById;
    private String imageUrl;
}
