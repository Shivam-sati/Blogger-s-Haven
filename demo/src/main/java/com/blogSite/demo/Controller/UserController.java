package com.blogSite.demo.Controller;

import com.blogSite.demo.Dto.ProfileUpdateRequest;
import com.blogSite.demo.Entity.User;
import com.blogSite.demo.LoginRequest;
import com.blogSite.demo.Service.FileStorageService;
import com.blogSite.demo.Service.JwtBlacklistService;
import com.blogSite.demo.Service.UserEntityService;
import com.blogSite.demo.Utilis.JwtUtilis;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserEntityService userEntityService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtilis jwtUtilis;
    @Autowired
    private JwtBlacklistService jwtBlacklistService;
    @Autowired
    private FileStorageService fileStorageService;


    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody User user) {
        try {
            // Check if username already exists
            if (userEntityService.findByUsername(user.getUserName()) != null) {
                return ResponseEntity.badRequest().body("Username already exists");
            }

            // Encode password before saving

            user.setDate(LocalDateTime.now());
            userEntityService.saveNewUser(user);



            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "User registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUserName(),
                            loginRequest.getPassword()
                    )
            );

            // Set authentication in the security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate the token using JwtUtilis
            String token = jwtUtilis.generateToken(loginRequest.getUserName());

            // Return the token and message
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", token,
                    "username", loginRequest.getUserName()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("message", "Welcome to dashboard");
        dashboardData.put("username", currentUsername);

        return ResponseEntity.ok(dashboardData);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
            jwtBlacklistService.blacklistToken(token);
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @PostMapping("/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("image") MultipartFile file) {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();
            User user = userEntityService.findByUsername(currentUsername);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Please select a file to upload"));
            }

            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Only image files are allowed"));
            }

            // Delete old profile image if it exists
            if (user.getImageFileName() != null) {
                fileStorageService.deleteFile(user.getImageFileName());
            }

            // Store the file and get the filename
            String fileName = fileStorageService.storeFile(file, currentUsername);

            // Update user with new image filename
            user.setImageFileName(fileName);
            user.setImageContentType(file.getContentType());
            // No longer storing image data in database
            user.setImageData(null);

            userEntityService.saveEntry(user);

            return ResponseEntity.ok(Map.of(
                    "message", "Profile image uploaded successfully",
                    "fileName", fileName
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }

    @GetMapping("/profile-image/{username}")
    public ResponseEntity<?> getProfileImage(@PathVariable String username) {
        try {
            User user = userEntityService.findByUsername(username);

            if (user == null || user.getImageFileName() == null) {
                return ResponseEntity.notFound().build();
            }

            // Get the file from storage
            byte[] imageData = fileStorageService.getFile(user.getImageFileName());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(user.getImageContentType()))
                    .body(imageData);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve image: " + e.getMessage()));
        }
    }

    @PutMapping("/edit")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();

            User userInDB = userEntityService.findByUsername(currentUsername);
            if (userInDB == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            // Check if new username is already taken by another user
            if (!currentUsername.equals(request.getUserName())) {
                User existingUser = userEntityService.findByUsername(request.getUserName());
                if (existingUser != null) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Username already taken"));
                }
            }

            // Update user details
            userInDB.setUserName(request.getUserName());
            userInDB.setEmail(request.getEmail());
            userInDB.setBio(request.getBio());

            userEntityService.saveEntry(userInDB);

            return ResponseEntity.ok(Map.of(
                    "message", "Profile updated successfully",
                    "userName", userInDB.getUserName(),
                    "email", userInDB.getEmail(),
                    "bio", userInDB.getBio()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update profile: " + e.getMessage()));
        }
    }
}



