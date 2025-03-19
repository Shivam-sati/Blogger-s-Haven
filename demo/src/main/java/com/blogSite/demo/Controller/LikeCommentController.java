package com.blogSite.demo.Controller;

import com.blogSite.demo.Entity.CommentEntity;
import com.blogSite.demo.Service.CommentService;
import com.blogSite.demo.Service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class LikeCommentController {

    @Autowired
    private LikeService likeService;

    @Autowired
    private CommentService commentService;

    /**
     * Toggle the like status for a blog post.
     * Returns the new like status along with the updated like count.
     */
    @PostMapping("/like-toggle")
    public ResponseEntity<?> toggleLike(@RequestParam String blogPostId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        boolean liked = likeService.toggleLike(blogPostId, userName);
        long likeCount = likeService.getLikeCount(blogPostId);
        return ResponseEntity.ok(Map.of("liked", liked, "likeCount", likeCount));
    }

    /**
     * Check if the current user has liked a specific blog post.
     */
    @GetMapping("/is-liked/{blogPostId}")
    public ResponseEntity<?> isLiked(@PathVariable String blogPostId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        boolean isLiked = likeService.isLikedByUser(blogPostId, userName);
        return ResponseEntity.ok(Map.of("isLiked", isLiked));
    }

    /**
     * Get the total like count for a blog post.
     */
    @GetMapping("/like-count/{blogPostId}")
    public ResponseEntity<?> getLikeCount(@PathVariable String blogPostId) {
        long count = likeService.getLikeCount(blogPostId);
        return ResponseEntity.ok(Map.of("likeCount", count));
    }

    /**
     * Add a new comment to a blog post.
     * Expects 'blogPostId' and 'commentText' as parameters.
     */
    @PostMapping("/add-comment")
    public ResponseEntity<?> addComment(@RequestParam String blogPostId,
                                        @RequestParam String commentText) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userName = authentication.getName();
        CommentEntity comment = commentService.addComment(blogPostId, userName, commentText);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    /**
     * Retrieve all comments for a blog post.
     */
    @GetMapping("/comments/{blogPostId}")
    public ResponseEntity<?> getComments(@PathVariable String blogPostId) {
        List<CommentEntity> comments = commentService.getComments(blogPostId);
        return ResponseEntity.ok(comments);
    }
}
