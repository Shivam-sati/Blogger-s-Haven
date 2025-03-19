package com.blogSite.demo.Repository;

import com.blogSite.demo.Entity.CommentEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<CommentEntity, ObjectId> {
    List<CommentEntity> findByBlogPostIdOrderByCommentedAtAsc(String blogPostId);
}
