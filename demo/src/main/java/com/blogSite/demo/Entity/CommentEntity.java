package com.blogSite.demo.Entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "comments")
@Data
@NoArgsConstructor
public class CommentEntity {
    @Id
    private ObjectId id;
    private String blogPostId;
    private String userName;
    private String commentText;
    private LocalDateTime commentedAt;
}
