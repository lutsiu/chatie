package com.example.chatie.Chatie.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Setter
@Getter
@ToString(exclude = "password")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Email
    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column
    private String lastName;

    @Column(columnDefinition = "TEXT")
    private String profilePictureUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime lastSeenAt;

    @Column
    private LocalDateTime lastLoginAt;

    @Builder.Default
    @Column(nullable = false)
    private boolean emailVerified = false;

    @Builder.Default
    @Column(nullable = false)
    private boolean isActive = true;

    @Column(length = 140)
    private String about;

    @Column
    private LocalDateTime passwordUpdatedAt;

    @Column
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        final LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        // canonicalize identifiers
        if (this.email != null) this.email = this.email.trim().toLowerCase();
        if (this.username != null) this.username = this.username.trim();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        if (this.email != null) this.email = this.email.trim().toLowerCase();
        if (this.username != null) this.username = this.username.trim();
    }
}
