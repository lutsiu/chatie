package com.example.chatie.Chatie.service.media;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
    /** Uploads an avatar image and returns the HTTPS URL. */
    String uploadAvatar(long userId, MultipartFile file);
}
