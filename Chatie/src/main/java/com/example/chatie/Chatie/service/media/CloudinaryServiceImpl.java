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
}
