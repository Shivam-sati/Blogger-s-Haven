package com.blogSite.demo.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "likes")
@Data
@NoArgsConstructor
public class LikeEntity {
    @Id
    private ObjectId id;
    // Store blog post id as a string (the hex representation from BlogPostEntity)
    private String blogPostId;
    private String userName;
    private LocalDateTime likedAt;
}
