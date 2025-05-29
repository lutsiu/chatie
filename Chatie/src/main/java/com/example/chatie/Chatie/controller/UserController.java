package com.example.chatie.Chatie.controller;

import com.example.chatie.Chatie.dto.user.UserDTO;
import com.example.chatie.Chatie.dto.user.UserRegisterDTO;
import com.example.chatie.Chatie.dto.user.UserUpdateDTO;
import com.example.chatie.Chatie.exception.global.NotFoundException;
import com.example.chatie.Chatie.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // create
    @PostMapping
    public ResponseEntity<UserDTO> registerUser(@Valid @RequestBody UserRegisterDTO dto) {
        return ResponseEntity.ok(userService.createUser(dto));
    }

    // get
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

    // update
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateDTO body) {
        return ResponseEntity.ok(userService.updateUser(id, body));
    }
    // delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
