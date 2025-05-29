package com.example.chatie.Chatie.dto.chat;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatUpdateDTO {
    @Size(min = 3, message = "Chat title should be at least 3 characters long")
    private String title;
}
