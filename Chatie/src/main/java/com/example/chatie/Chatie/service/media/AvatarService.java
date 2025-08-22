package com.example.chatie.Chatie.service.media;

import com.example.chatie.Chatie.dto.user.UserDTO;
import org.springframework.web.multipart.MultipartFile;

public interface AvatarService {
    UserDTO uploadAvatar(long userId, MultipartFile file);
    UserDTO uploadAvatarByUsername(String username, MultipartFile file);
}
