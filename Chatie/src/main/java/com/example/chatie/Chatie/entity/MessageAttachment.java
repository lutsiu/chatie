package com.example.chatie.Chatie.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "message_attachment")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MessageAttachment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id")
    private Message message;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String url;

    private String mime;
    private Long sizeBytes;
    private Integer width;
    private Integer height;
    private Integer durationSec;
    private String originalName;

    @Column(nullable = false)
    private Integer position = 0;
}
