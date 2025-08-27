package com.example.chatie.Chatie.service.media;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public String uploadAvatar(long userId, MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("Empty file");
            }

            String folder = "users/" + userId + "/avatar";

            // IMPORTANT: use bytes (NOT InputStream) for cloudinary-java 2.x upload()
            Map<?, ?> res = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "public_id", "avatar",
                            "overwrite", true,
                            "unique_filename", false,
                            "invalidate", true,
                            "resource_type", "image"
                    )
            );

            Object url = res.get("secure_url");
            if (url == null) {
                throw new IllegalStateException("Cloudinary did not return secure_url");
            }
            return url.toString();

        } catch (Exception e) {
            log.error("Cloudinary upload failed: {}", e.getMessage(), e);
            throw new RuntimeException("Avatar upload failed: " + e.getMessage(), e);
        }
    }
    @Override
    public Uploaded uploadMessageMedia(long chatId, long senderId, MultipartFile file, String publicIdHint) {
        try {
            if (file == null || file.isEmpty()) throw new IllegalArgumentException("Empty file");

            String folder = "chats/" + chatId + "/uploads/" + senderId;

            Map<?, ?> res = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "use_filename", true,
                            "unique_filename", true,
                            "resource_type", "auto",     // auto-detect image/video/raw
                            "public_id", publicIdHint != null ? publicIdHint : null
                    )
            );

            String url = (String) res.get("secure_url");
            if (url == null) throw new IllegalStateException("Cloudinary did not return secure_url");

            Number width    = (Number) res.get("width");
            Number height   = (Number) res.get("height");
            Number duration = (Number) res.get("duration"); // videos only
            Number bytes    = (Number) res.get("bytes");

            return Uploaded.builder()
                    .url(url)
                    .mime(file.getContentType())
                    .bytes(bytes != null ? bytes.longValue() : file.getSize())
                    .width(width != null ? width.intValue() : null)
                    .height(height != null ? height.intValue() : null)
                    .durationSec(duration != null ? (int) Math.round(duration.doubleValue()) : null)
                    .originalName(file.getOriginalFilename())
                    .build();

        } catch (Exception e) {
            log.error("Cloudinary message upload failed: {}", e.getMessage(), e);
            throw new RuntimeException("Message media upload failed: " + e.getMessage(), e);
        }
    }
}
