// src/main/java/com/blogSite/demo/Service/BlogPostService.java
package com.blogSite.demo.Service;

import com.blogSite.demo.Entity.BlogPostEntity;
import com.blogSite.demo.Entity.User;
import com.blogSite.demo.Repository.BlogPostRepo;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
public class BlogPostService {
    @Autowired
    private BlogPostRepo blogPostRepo;
    @Autowired
    private UserEntityService userEntityService;

    public List<BlogPostEntity> getAll() {
        return blogPostRepo.findAll();
    }

    public BlogPostEntity saveEntry(BlogPostEntity blogPostEntity, String userName) {
        User user = userEntityService.findByUsername(userName);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        blogPostEntity.setDate(LocalDateTime.now());
        BlogPostEntity saved = blogPostRepo.save(blogPostEntity);
        user.getBlogPostEntities().add(saved);
        userEntityService.saveEntry(user);
        return saved;
    }

    public boolean deleteById(ObjectId id, String userName) {
        boolean removed = false;
        try {
            User user = userEntityService.findByUsername(userName);
            if (user == null) {
                throw new RuntimeException("User not found");
            }
            removed = user.getBlogPostEntities().removeIf(post -> post.getId().equals(id));
            if (removed) {
                userEntityService.saveEntry(user);
                blogPostRepo.deleteById(id);
                log.info("Deleted blog post with ID {} for user {}", id, userName);
            } else {
                log.warn("User {} does not own post with ID {}", userName, id);
            }
        } catch (Exception e) {
            log.error("Error occurred while deleting blog post with ID {}", id, e);
            throw new RuntimeException("An error occurred while deleting the entry.", e);
        }
        return removed;
    }

    public List<BlogPostEntity> getBlogsByType(String type) {
        return blogPostRepo.findByType(type);
    }

    public Optional<BlogPostEntity> findByid(ObjectId id) {
        return blogPostRepo.findById(id);
    }

    public List<BlogPostEntity> getBlogsByIds(List<String> ids) {
        return blogPostRepo.findByIdIn(ids);
    }
}