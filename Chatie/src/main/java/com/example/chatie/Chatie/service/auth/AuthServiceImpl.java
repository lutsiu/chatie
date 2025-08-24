package com.example.chatie.Chatie.service.auth;

import com.example.chatie.Chatie.dto.auth.AuthResponse;
import com.example.chatie.Chatie.dto.auth.LoginRequest;
import com.example.chatie.Chatie.dto.auth.RegisterRequest;
import com.example.chatie.Chatie.dto.user.UserDTO;
import com.example.chatie.Chatie.dto.user.UserRegisterDTO;
import com.example.chatie.Chatie.entity.User;
import com.example.chatie.Chatie.exception.global.NotFoundException;
import com.example.chatie.Chatie.mapper.UserMapper;
import com.example.chatie.Chatie.repository.UserRepository;
import com.example.chatie.Chatie.security.JwtService;
import com.example.chatie.Chatie.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwt;

    @Override
    public AuthResponse register(RegisterRequest req) {
        UserRegisterDTO dto = UserRegisterDTO.builder()
                .email(req.getEmail())
                .username(req.getUsername())
                .password(req.getPassword())
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .build();

        UserDTO created = userService.createUser(dto);

        User user = userRepository.findById(created.getId())
                .orElseThrow(() -> new NotFoundException("User not found after registration"));

        String access = jwt.generateAccessToken(user);
        String refresh = jwt.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(access)
                .refreshToken(refresh)
                .user(UserMapper.toDTO(user))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest req) {
        String id = req.getIdentifier().trim();
        User user = (id.contains("@")
                ? userRepository.findByEmailIgnoreCase(id)
                : userRepository.findByUsernameIgnoreCase(id))
                .orElseThrow(() -> new NotFoundException("Invalid credentials"));

//        if (!user.isActive() || user.getDeletedAt() != null) {
//            throw new NotFoundException("Account disabled");
//        }
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new NotFoundException("Invalid credentials");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String access = jwt.generateAccessToken(user);
        String refresh = jwt.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(access)
                .refreshToken(refresh)
                .user(UserMapper.toDTO(user))
                .build();
    }
}
