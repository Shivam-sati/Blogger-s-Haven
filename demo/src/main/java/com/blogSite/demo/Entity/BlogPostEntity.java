// src/main/java/com/blogSite/demo/Entity/BlogPostEntity.java
package com.blogSite.demo.Entity;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "BlogPost")
@Data
@NoArgsConstructor
public class BlogPostEntity {
    @Id
    private ObjectId id;
    @NotBlank
    private String type;
    @NotBlank
    private String title;
    @NotBlank
    private String description;
    private LocalDateTime date;
    private int likeCount;
    private String imageUrl; // Add this field

    public String getId() {
        return id != null ? id.toHexString() : null; // Convert ObjectId to its string representation
    }
}