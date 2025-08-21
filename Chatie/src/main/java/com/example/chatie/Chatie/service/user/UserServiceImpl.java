package com.example.chatie.Chatie.service.user;

import com.example.chatie.Chatie.dto.user.UserDTO;
import com.example.chatie.Chatie.dto.user.UserRegisterDTO;
import com.example.chatie.Chatie.dto.user.UserUpdateDTO;
import com.example.chatie.Chatie.entity.User;
import com.example.chatie.Chatie.exception.user.DuplicateEmailException;
import com.example.chatie.Chatie.exception.user.DuplicateUsernameException;
import com.example.chatie.Chatie.exception.global.NotFoundException;
import com.example.chatie.Chatie.mapper.UserMapper;
import com.example.chatie.Chatie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDTO createUser(UserRegisterDTO dto) {
        final String email = dto.getEmail().trim().toLowerCase();
        final String username = dto.getUsername().trim();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateEmailException("Email is already in use " + email);
        }
        if (userRepository.existsByUsernameIgnoreCase(username)) {
            throw new DuplicateUsernameException("Username already in use: " + username);
        }

        User user = UserMapper.toEntity(dto);
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setPasswordUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        return UserMapper.toDTO(saved);
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found with ID: " + id));
        return UserMapper.toDTO(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(UserMapper::toDTO).toList();
    }

    @Override
    public Optional<UserDTO> findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email.trim().toLowerCase()).map(UserMapper::toDTO);
    }

    @Override
    public Optional<UserDTO> findByUsername(String username) {
        return userRepository.findByUsernameIgnoreCase(username.trim()).map(UserMapper::toDTO);
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long userId, UserUpdateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));

        if (dto.getEmail() != null) {
            String newEmail = dto.getEmail().trim().toLowerCase();
            if (!newEmail.equals(user.getEmail()) && userRepository.existsByEmailIgnoreCase(newEmail)) {
                throw new DuplicateEmailException("Email already in use: " + newEmail);
            }
            user.setEmail(newEmail);
        }

        if (dto.getUsername() != null) {
            String newUsername = dto.getUsername().trim();
            if (!newUsername.equals(user.getUsername()) && userRepository.existsByUsernameIgnoreCase(newUsername)) {
                throw new DuplicateUsernameException("Username already in use: " + newUsername);
            }
            user.setUsername(newUsername);
        }

        // Map simple fields (first/last, avatar, about)
        UserMapper.updateUserFromDTO(user, dto);

        if (dto.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            user.setPasswordUpdatedAt(LocalDateTime.now());
        }

        User saved = userRepository.save(user);
        return UserMapper.toDTO(saved);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new NotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmailIgnoreCase(email.trim().toLowerCase());
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsernameIgnoreCase(username.trim());
    }
}
