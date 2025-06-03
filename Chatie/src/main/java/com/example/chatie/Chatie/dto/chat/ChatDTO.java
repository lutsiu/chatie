package com.example.chatie.Chatie.dto.chat;

import com.example.chatie.Chatie.entity.Chat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatDTO {
    private Long id;
    private String title;
    private boolean isGroup;
    private Long createdById;
    private String createdByUsername;
    private String imageUrl;

}
