package com.blogSite.demo.Controller;


import com.blogSite.demo.Entity.BlogPostEntity;
import com.blogSite.demo.Entity.User;
import com.blogSite.demo.LoginRequest;
import com.blogSite.demo.Service.BlogPostService;
import com.blogSite.demo.Service.UserEntityService;
import com.blogSite.demo.Utilis.JwtUtilis;
import jakarta.validation.Valid;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserEntityService userEntityService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtUtilis jwtUtilis;
    @Autowired
    private BlogPostService blogPostService;

    @PostMapping("/create-admin-user")
    public void CreateUser(@RequestBody User user) {
        userEntityService.saveAdmin(user);
    }

       @PostMapping("/admin-login")
    public ResponseEntity<?> adminLogin(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUserName(),
                            loginRequest.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtUtilis.generateToken(loginRequest.getUserName());

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", token,
                    "username", loginRequest.getUserName()
            ));
        } catch (Exception e) {
            e.printStackTrace(); // Print stack trace for debugging
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        }
    }



    @GetMapping("/users/all")
    public ResponseEntity<?> getAllUsers() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userEntityService.findByUsername(authentication.getName());

        if (user != null && user.getRoles().contains("ADMIN")) {
            List<User> users = userEntityService.getAll();
            return new ResponseEntity<>(users, HttpStatus.OK);
        }
        return new ResponseEntity<>("Access Denied", HttpStatus.FORBIDDEN);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUser(@PathVariable ObjectId id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userEntityService.findByUsername(authentication.getName());
        if (user != null && user.getRoles().contains("ADMIN")) {
            Optional<User> user1 = userEntityService.getUser(id);
            return new ResponseEntity<>(user1, HttpStatus.OK);
        }
        return new ResponseEntity<>("error",HttpStatus.FORBIDDEN);
    }

    @GetMapping("/userBlogs")
    public ResponseEntity<?> getBlogsByIds(@RequestParam List<String> ids) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userEntityService.findByUsername(authentication.getName());
        if (user != null && user.getRoles().contains("ADMIN")) {
            List<BlogPostEntity> all = blogPostService.getBlogsByIds(ids);
            return new ResponseEntity<>(all, HttpStatus.OK);
        }
        return new ResponseEntity<>("error",HttpStatus.FORBIDDEN);
    }

    @DeleteMapping("/users/deleteUser/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable ObjectId id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userEntityService.findByUsername(authentication.getName());

        if (user != null && user.getRoles().contains("ADMIN")) {
            userEntityService.deleteUser(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>("Access Denied", HttpStatus.FORBIDDEN);
    }




}
