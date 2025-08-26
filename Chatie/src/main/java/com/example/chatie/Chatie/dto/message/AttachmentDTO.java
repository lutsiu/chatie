package com.example.chatie.Chatie.dto.message;

import lombok.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AttachmentDTO {
    private Long id;
    private String url;
    private String mime;
    private Long sizeBytes;
    private Integer width;
    private Integer height;
    private Integer durationSec;
    private String originalName;
    private Integer position;
}
