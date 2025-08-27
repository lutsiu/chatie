package com.example.chatie.Chatie.service.media;

import org.springframework.web.multipart.MultipartFile;

import lombok.Builder;
import lombok.Value;
public interface CloudinaryService {
    /** Uploads an avatar image and returns the HTTPS URL. */
    String uploadAvatar(long userId, MultipartFile file);
    Uploaded uploadMessageMedia(long chatId, long senderId, MultipartFile file, String publicIdHint);

    @Value
    @Builder
    class Uploaded {
        String url;
        String mime;
        Long   bytes;
        Integer width;
        Integer height;
        Integer durationSec;     // videos only
        String  originalName;
    }
}
