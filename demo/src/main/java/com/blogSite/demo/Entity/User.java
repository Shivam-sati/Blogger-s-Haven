package com.blogSite.demo.Entity;

import lombok.Data;
import lombok.NonNull;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
public class User {
    @Id
    private ObjectId id;

    @NonNull
    @Indexed(unique = true)
    private String userName;

    @NonNull
    @Indexed(unique = true)
    private String email;

    @NonNull
    private String password;
    private String bio;

    private LocalDateTime date;
    private List<String> roles;

    // New fields for profile image
    private String imageFileName;
    private String imageContentType;
    private byte[] imageData;

    @DBRef
    private List<BlogPostEntity> blogPostEntities = new ArrayList<>();

    public String getId() {
        return id != null ? id.toHexString() : null; // Convert ObjectId to its string representation
    }
}