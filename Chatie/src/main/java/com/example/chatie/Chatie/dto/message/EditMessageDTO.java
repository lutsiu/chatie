package com.example.chatie.Chatie.dto.message;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class EditMessageDTO {
    private String content; // only text/caption for now
}
