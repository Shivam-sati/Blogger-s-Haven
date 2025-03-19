// src/main/java/com/blogSite/demo/Controller/BlogPostController.java
package com.blogSite.demo.Controller;

import com.blogSite.demo.Entity.BlogPostEntity;
import com.blogSite.demo.Entity.User;
import com.blogSite.demo.Service.BlogPostService;
import com.blogSite.demo.Service.UserEntityService;
import jakarta.validation.Valid;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class BlogPostController {
    @Autowired
    private BlogPostService blogPostService;
    @Autowired
    private UserEntityService userEntityService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getBlogs() {
        List<BlogPostEntity> all = blogPostService.getAll();
        return new ResponseEntity<>(all, HttpStatus.OK);
    }

    @GetMapping("/blogs/type/technology")
    public ResponseEntity<?> getBlogsByTechnologyType() {
        List<BlogPostEntity> blogs = blogPostService.getBlogsByType("Technology");
        if (blogs.isEmpty()) {
            return new ResponseEntity<>("No blogs found for the specified type", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(blogs, HttpStatus.OK);
    }  @GetMapping("/blogs/type/lifestyle")
    public ResponseEntity<?> getBlogsByLifeStyleType() {
        List<BlogPostEntity> blogs = blogPostService.getBlogsByType("lifestyle");
        if (blogs.isEmpty()) {
            return new ResponseEntity<>("No blogs found for the specified type", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(blogs, HttpStatus.OK);
    }  @GetMapping("/blogs/type/health")
    public ResponseEntity<?> getBlogsByHealthType() {
        List<BlogPostEntity> blogs = blogPostService.getBlogsByType("Health");
        if (blogs.isEmpty()) {
            return new ResponseEntity<>("No blogs found for the specified type", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(blogs, HttpStatus.OK);
    }
    @GetMapping("/blogs/type/travel")
    public ResponseEntity<?> getBlogsByMedical(){
        List<BlogPostEntity> blogs= blogPostService.getBlogsByType("Travel");
        if(blogs.isEmpty()){
            return new ResponseEntity<>("No blogs Found for the secified type",HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(blogs,HttpStatus.OK);
    }


    @PostMapping("/blog-posting")
    public ResponseEntity<BlogPostEntity> createEntity(@Valid @RequestBody BlogPostEntity myEntry) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userName = authentication.getName(); // Extracted from JWT via JwtFilter
            blogPostService.saveEntry(myEntry, userName);
            return new ResponseEntity<>(myEntry, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/blogs/{id}")
    public ResponseEntity<?> getBlogsOfUsers(@PathVariable ObjectId id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User user = userEntityService.findByUsername(userName);
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.UNAUTHORIZED);
        }
        boolean ownsPost = user.getBlogPostEntities()
                .stream()
                .anyMatch(blogPost -> blogPost.getId().equals(id));
        if (!ownsPost) {
            return new ResponseEntity<>("Access denied", HttpStatus.FORBIDDEN);
        }
        Optional<BlogPostEntity> blogPostEntity = blogPostService.findByid(id);
        if (blogPostEntity.isPresent()) {
            return new ResponseEntity<>(blogPostEntity.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/user-details")
    public ResponseEntity<?> getUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        String userName = authentication.getName();
        User user = userEntityService.findByUsername(userName);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/myblogs")
    public ResponseEntity<?> getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        User user = userEntityService.findByUsername(userName);
        if (user != null) {
            List<BlogPostEntity> userBlogs = user.getBlogPostEntities();
            if (!userBlogs.isEmpty()) {
                return new ResponseEntity<>(userBlogs, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/getBlog/read/{id}")
    public ResponseEntity<?> getBlogById(@PathVariable String id) {
        try {
            ObjectId objectId = new ObjectId(id); // Convert the string to ObjectId
            Optional<BlogPostEntity> blog = blogPostService.findByid(objectId);
            return ResponseEntity.ok(blog);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Blog not found.");
        }
    }

    @GetMapping("/getBlog/profile/{id}")
    public ResponseEntity<?> getprofileBlogById(@PathVariable String id) {
        try {
            ObjectId objectId = new ObjectId(id); // Convert the string to ObjectId
            Optional<BlogPostEntity> blog = blogPostService.findByid(objectId);
            return ResponseEntity.ok(blog);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Blog not found.");
        }
    }

    @DeleteMapping("/delete-blog/{id}")
    public ResponseEntity<?> deleteBlogById(@PathVariable ObjectId id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        try {
            boolean removed = blogPostService.deleteById(id, username);
            if (removed) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>("Post not found or unauthorized", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("An error occurred while deleting the entry.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}