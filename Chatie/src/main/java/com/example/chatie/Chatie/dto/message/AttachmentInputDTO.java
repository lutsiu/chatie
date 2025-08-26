package com.example.chatie.Chatie.dto.message;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AttachmentInputDTO {
    private String url;         // URL after upload (frontend can upload first)
    private String mime;
    private Long sizeBytes;
    private Integer width;
    private Integer height;
    private Integer durationSec;
    private String originalName;
    private Integer position;
}
