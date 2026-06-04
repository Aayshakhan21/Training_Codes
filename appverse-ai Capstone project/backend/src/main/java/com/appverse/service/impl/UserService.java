package com.appverse.service.impl;

import com.appverse.dto.request.UserDTOs.ChangePasswordRequest;
import com.appverse.dto.request.UserDTOs.UpdateProfileRequest;
import com.appverse.entity.User;
import com.appverse.exception.BadRequestException;
import com.appverse.exception.DuplicateResourceException;
import com.appverse.exception.ResourceNotFoundException;
import com.appverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", 0L));
    }

    @Transactional
    public User updateProfile(String email, UpdateProfileRequest req) {
        User user = getByEmail(email);

        if (req.getEmail() != null && !req.getEmail().equalsIgnoreCase(user.getEmail())
                && userRepository.existsByEmail(req.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + req.getEmail());
        }
        if (req.getUsername() != null && !req.getUsername().equalsIgnoreCase(user.getUsername())
                && userRepository.existsByUsername(req.getUsername())) {
            throw new DuplicateResourceException("Username taken: " + req.getUsername());
        }

        if (req.getFullName() != null) user.setFullName(req.getFullName());
        if (req.getUsername() != null) user.setUsername(req.getUsername());
        if (req.getEmail() != null) user.setEmail(req.getEmail());

        return userRepository.save(user);
    }

    @Transactional
    public User changePassword(String email, ChangePasswordRequest req) {
        User user = getByEmail(email);
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        return userRepository.save(user);
    }

    @Transactional
    public User updateAvatar(String email, MultipartFile avatar) {
        if (avatar == null || avatar.isEmpty()) {
            throw new BadRequestException("Avatar file is required");
        }

        User user = getByEmail(email);
        try {
            Path directory = Path.of("uploads", "avatars");
            Files.createDirectories(directory);

            String originalName = avatar.getOriginalFilename() == null ? "avatar" : avatar.getOriginalFilename();
            String extension = originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf('.'))
                    : ".png";
            String fileName = UUID.randomUUID() + extension;
            Path destination = directory.resolve(fileName);
            Files.copy(avatar.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            user.setAvatarUrl("/uploads/avatars/" + fileName);
            return userRepository.save(user);
        } catch (IOException ex) {
            throw new BadRequestException("Failed to upload avatar");
        }
    }
}
