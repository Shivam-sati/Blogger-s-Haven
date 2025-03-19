// src/components/BlogPost.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./pages/Navbar";
import axios from "axios";
import blogImage from "../components/Assests/alok.png";
import Like from "../Like";
import Comment from "../Comment";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/auth/getBlog/read/${id}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Navbar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Navbar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-100 flex flex-col">
      {/* Fixed Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 flex items-center bg-white bg-opacity-90 hover:bg-opacity-100 px-3 py-2 rounded shadow"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        <span className="text-indigo-600 font-medium">Back</span>
      </button>

      <Navbar />
      <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {post?.title}
          </h1>
          <div className="text-sm text-gray-500 mb-6">
            Posted on {new Date(post?.date).toLocaleDateString()}
          </div>
          {post?.imageUrl ? (
            <img
              src={post.imageUrl}
              alt="Blog"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          ) : (
            <img
              src={blogImage}
              alt="Blog"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post?.description}
            </p>
          </div>
          {/* Like and Comment Section */}
          <Like blogPostId={post?.id} />
          <Comment blogPostId={post?.id} />
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
