package com.blogSite.demo.Repository;

import com.blogSite.demo.Entity.BlogPostEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface BlogPostRepo extends MongoRepository<BlogPostEntity, ObjectId> {
    List<BlogPostEntity> findByIdIn(List<String> ids);
    List<BlogPostEntity> findByType(String type);
}
