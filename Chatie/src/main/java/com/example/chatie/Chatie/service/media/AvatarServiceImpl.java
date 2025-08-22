package com.example.chatie.Chatie.service.media;

import com.example.chatie.Chatie.dto.user.UserDTO;
import com.example.chatie.Chatie.entity.User;
import com.example.chatie.Chatie.exception.global.NotFoundException;
import com.example.chatie.Chatie.mapper.UserMapper;
import com.example.chatie.Chatie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AvatarServiceImpl implements AvatarService {

    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public UserDTO uploadAvatar(long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));

        String url = cloudinaryService.uploadAvatar(user.getId(), file);
        System.out.println("url");
        System.out.println(url);

        user.setProfilePictureUrl(url);
        user.setUpdatedAt(LocalDateTime.now());

        return UserMapper.toDTO(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserDTO uploadAvatarByUsername(String username, MultipartFile file) {
        User user = userRepository.findByUsernameIgnoreCase(username.trim())
                .orElseThrow(() -> new NotFoundException("User not found: " + username));

        String url = cloudinaryService.uploadAvatar(user.getId(), file);
        user.setProfilePictureUrl(url);
        user.setUpdatedAt(LocalDateTime.now());

        return UserMapper.toDTO(userRepository.save(user));
    }
}
