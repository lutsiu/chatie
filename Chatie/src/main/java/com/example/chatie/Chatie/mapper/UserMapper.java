package com.example.chatie.Chatie.mapper;

import com.example.chatie.Chatie.dto.user.UserDTO;
import com.example.chatie.Chatie.dto.user.UserRegisterDTO;
import com.example.chatie.Chatie.dto.user.UserUpdateDTO;
import com.example.chatie.Chatie.entity.User;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .profilePictureUrl(user.getProfilePictureUrl())
                .about(user.getAbout())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }

    public static User toEntity(UserRegisterDTO dto) {
        return User.builder()
                .email(dto.getEmail())
                .username(dto.getUsername())
                .password(dto.getPassword()) // encode in service
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .build();
    }

    public static void updateUserFromDTO(User user, UserUpdateDTO dto) {
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getUsername() != null) user.setUsername(dto.getUsername());
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getProfilePictureUrl() != null) user.setProfilePictureUrl(dto.getProfilePictureUrl());
        if (dto.getAbout() != null) user.setAbout(dto.getAbout());
        if (dto.getPassword() != null) user.setPassword(dto.getPassword()); // encode in service
    }
}
