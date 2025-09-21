package com.example.chatie.Chatie.controller;

import com.example.chatie.Chatie.dto.user.UserDTO;
import com.example.chatie.Chatie.dto.user.UserRegisterDTO;
import com.example.chatie.Chatie.dto.user.UserUpdateDTO;
import com.example.chatie.Chatie.exception.global.NotFoundException;
import com.example.chatie.Chatie.service.media.AvatarServiceImpl;
import com.example.chatie.Chatie.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AvatarServiceImpl avatarService;

    // === create ===
    @PostMapping
    public ResponseEntity<UserDTO> registerUser(@Valid @RequestBody UserRegisterDTO dto) {
        return ResponseEntity.ok(userService.createUser(dto));
    }

    // === read ===
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/by-email")
    public ResponseEntity<UserDTO> findByEmail(@RequestParam String email) {
        return userService.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new NotFoundException("User not found with email: " + email));
    }

    @GetMapping("/by-username")
    public ResponseEntity<UserDTO> findByUsername(@RequestParam String username) {
        return userService.findByUsername(username)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new NotFoundException("User not found with username: " + username));
    }

    // === update ===
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDTO body
    ) {
        return ResponseEntity.ok(userService.updateUser(id, body));
    }

    // === delete ===
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // === me: get current user ===
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getMe(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    // === me: patch current user (all fields optional) ===
    @PatchMapping("/me")
    public ResponseEntity<UserDTO> updateMe(
            @RequestBody UserUpdateDTO body,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(userService.updateUser(userId, body));
    }


    @PostMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserDTO> uploadMyAvatar(
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Long userId = Long.parseLong(authentication.getName());
        return ResponseEntity.ok(avatarService.uploadAvatar(userId, file));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(
            @RequestParam("q") String q,
            @RequestParam(value = "limit", defaultValue = "20") int limit,
            Authentication authentication
    ) {
        Long meId = authentication != null ? Long.parseLong(authentication.getName()) : null;
        return ResponseEntity.ok(userService.search(q, limit, meId));
    }
}
