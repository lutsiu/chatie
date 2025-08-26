package com.example.chatie.Chatie.service.user;

import com.example.chatie.Chatie.dto.user.UserDTO;
import com.example.chatie.Chatie.dto.user.UserRegisterDTO;
import com.example.chatie.Chatie.dto.user.UserUpdateDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {

    // create
    UserDTO createUser(UserRegisterDTO userRegisterDTO);

    // read
    UserDTO getUserById(Long id);
    List<UserDTO> getAllUsers();
    Optional<UserDTO> findByEmail(String email);
    Optional<UserDTO> findByUsername(String username);

    List<UserDTO> search(String q, int limit, Long excludeUserId);
    // update
    UserDTO updateUser(Long userId, UserUpdateDTO updatedUserDTO);

    // delete
    void deleteUser(Long id);

    // validation
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
