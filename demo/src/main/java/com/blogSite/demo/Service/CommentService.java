package com.blogSite.demo.Service;

import com.blogSite.demo.Entity.CommentEntity;
import com.blogSite.demo.Repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    /**
     * Adds a new comment to a blog post.
     * @param blogPostId the id of the blog post
     * @param userName the name of the user commenting
     * @param commentText the comment content
     * @return the saved CommentEntity
     */
    public CommentEntity addComment(String blogPostId, String userName, String commentText) {
        CommentEntity comment = new CommentEntity();
        comment.setBlogPostId(blogPostId);
        comment.setUserName(userName);
        comment.setCommentText(commentText);
        comment.setCommentedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    /**
     * Retrieves all comments for the given blog post in chronological order.
     * @param blogPostId the id of the blog post
     * @return list of comments
     */
    public List<CommentEntity> getComments(String blogPostId) {
        return commentRepository.findByBlogPostIdOrderByCommentedAtAsc(blogPostId);
    }
}
