// src/components/Comment.js
import React, { useState, useEffect } from "react";

const Comment = ({ blogPostId }) => {
  const token = localStorage.getItem("token");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchComments();
  }, [blogPostId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/comments/${blogPostId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Error fetching comments", err);
    }
  };

  const handleAddComment = async () => {
    if (commentText.trim() === "") return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/add-comment?blogPostId=${blogPostId}&commentText=${encodeURIComponent(
          commentText
        )}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const newComment = await response.json();
        setComments([...comments, newComment]);
        setCommentText("");
      } else {
        console.error("Failed to add comment");
      }
    } catch (err) {
      console.error("Error adding comment", err);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">Comments</h3>
      <div className="space-y-2">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="p-2 border rounded">
              <p className="text-sm text-gray-800">
                <strong>{comment.userName}:</strong> {comment.commentText}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(comment.commentedAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default Comment;
