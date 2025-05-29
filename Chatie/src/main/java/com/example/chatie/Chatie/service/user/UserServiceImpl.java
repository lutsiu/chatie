package com.example.chatie.Chatie.service.user;

import com.example.chatie.Chatie.dto.user.UserDTO;
import com.example.chatie.Chatie.dto.user.UserRegisterDTO;
import com.example.chatie.Chatie.dto.user.UserUpdateDTO;
import com.example.chatie.Chatie.entity.User;
import com.example.chatie.Chatie.exception.user.DuplicateEmailException;
import com.example.chatie.Chatie.exception.user.DuplicateUsernameException;
import com.example.chatie.Chatie.exception.user.UserNotFoundException;
import com.example.chatie.Chatie.mapper.UserMapper;
import com.example.chatie.Chatie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {


    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Override
    // add exception
    public UserDTO createUser(UserRegisterDTO userRegisterDTO) {
        // check if email is already exists
        if (userRepository.existsByEmail(userRegisterDTO.getEmail())) {
            throw new DuplicateEmailException(
                    "Email is already in use " + userRegisterDTO.getEmail());
        }
        // check if username is already exists
        if (userRepository.existsByUsername(userRegisterDTO.getUsername())) {
            throw new DuplicateUsernameException(
                    "Username already in use: " + userRegisterDTO.getUsername());
        }
        // convert registration dto to entity
        User user = UserMapper.toEntity(userRegisterDTO);
        // encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // save user to database
        User savedUser = userRepository.save(user);
        // return clean dto without password and redundant data
        return UserMapper.toDTO(savedUser);
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
        return UserMapper.toDTO(user); // convert to dto
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users
                .stream()// translate list to stream
                .map(UserMapper::toDTO) // convert each user to dto
                .toList(); // return list
    }

    @Override
    public Optional<UserDTO> findByEmail(String email) {
        Optional<User> possibleUser = userRepository.findByEmail(email);
        return possibleUser.map(UserMapper::toDTO); // convert to dto
    }

    @Override
    public Optional<UserDTO> findByUsername(String username) {
        Optional<User> possibleUser = userRepository.findByUsername(username);
        return possibleUser.map(UserMapper::toDTO); // convert to dto
    }

    @Override
    public UserDTO updateUser(Long userId, UserUpdateDTO updatedUserDTO) {
        // find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        // check if new email / username are taken by another user
        if (
                updatedUserDTO.getEmail() != null && // check if updated dto has email
                !updatedUserDTO.getEmail().equals(user.getEmail()) && // check if emails are not the same
                userRepository.existsByEmail(updatedUserDTO.getEmail()) // email already in use
        ) {
            throw new DuplicateEmailException(
                    "Email already in use: " + updatedUserDTO.getEmail());
        }

        if (
                updatedUserDTO.getUsername() != null && // check if updated dto has email
                !updatedUserDTO.getUsername().equals(user.getUsername()) && // check if emails are not the same
                userRepository.existsByUsername(updatedUserDTO.getUsername()) // username already in use
        ) {
            throw new DuplicateUsernameException(
                    "Username already in use: " + updatedUserDTO.getUsername());
        }

        // update user
        UserMapper.updateUserFromDTO(user, updatedUserDTO);

        // encode password
        if (updatedUserDTO.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(updatedUserDTO.getPassword()));
        }
        // save and return user as DTO
        User savedUser = userRepository.save(user);
        return UserMapper.toDTO(savedUser);

    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
}
