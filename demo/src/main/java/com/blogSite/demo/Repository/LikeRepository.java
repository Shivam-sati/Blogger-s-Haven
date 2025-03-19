package com.blogSite.demo.Repository;

import com.blogSite.demo.Entity.LikeEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LikeRepository extends MongoRepository<LikeEntity, ObjectId> {
    LikeEntity findByBlogPostIdAndUserName(String blogPostId, String userName);
    void deleteByBlogPostIdAndUserName(String blogPostId, String userName);
    long countByBlogPostId(String blogPostId);
}
