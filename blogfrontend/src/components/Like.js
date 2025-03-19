// src/components/Like.js
import React, { useState, useEffect } from "react";

const Like = ({ blogPostId }) => {
  const token = localStorage.getItem("token");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchLikeStatus();
    fetchLikeCount();
  }, [blogPostId]);

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/is-liked/${blogPostId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setLiked(data.isLiked);
      }
    } catch (err) {
      console.error("Error fetching like status", err);
    }
  };

  const fetchLikeCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/like-count/${blogPostId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setLikeCount(data.likeCount);
      }
    } catch (err) {
      console.error("Error fetching like count", err);
    }
  };

  const handleToggleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/like-toggle?blogPostId=${blogPostId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      } else {
        console.error("Failed to toggle like");
      }
    } catch (err) {
      console.error("Error toggling like", err);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button onClick={handleToggleLike} className="focus:outline-none">
        {liked ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="red"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="24"
            height="24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.121 19.364l-.707-.707C1.514 15.757 1.514 11.243 4.414 8.343a5.984 5.984 0 018.486 0 5.984 5.984 0 018.486 0c2.9 2.9 2.9 7.414 0 10.314l-.707.707-8.485 8.485-8.486-8.485z"
            />
          </svg>
        )}
      </button>
      <span>
        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
      </span>
    </div>
  );
};

export default Like;
