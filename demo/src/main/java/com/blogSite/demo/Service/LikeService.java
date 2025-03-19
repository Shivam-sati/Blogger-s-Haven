package com.blogSite.demo.Service;

import com.blogSite.demo.Entity.LikeEntity;
import com.blogSite.demo.Repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    /**
     * Toggles the like for a blog post by the given user.
     * If a like already exists, it will be removed (unlike);
     * otherwise, a new like is created.
     * @param blogPostId the id of the blog post
     * @param userName the name of the user
     * @return true if the post is liked after toggling, false if unliked.
     */
    public boolean toggleLike(String blogPostId, String userName) {
        LikeEntity existingLike = likeRepository.findByBlogPostIdAndUserName(blogPostId, userName);
        if (existingLike != null) {
            likeRepository.deleteByBlogPostIdAndUserName(blogPostId, userName);
            return false;
        } else {
            LikeEntity like = new LikeEntity();
            like.setBlogPostId(blogPostId);
            like.setUserName(userName);
            like.setLikedAt(LocalDateTime.now());
            likeRepository.save(like);
            return true;
        }
    }

    public long getLikeCount(String blogPostId) {
        return likeRepository.countByBlogPostId(blogPostId);
    }

    public boolean isLikedByUser(String blogPostId, String userName) {
        return likeRepository.findByBlogPostIdAndUserName(blogPostId, userName) != null;
    }
}
