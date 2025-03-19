// src/components/BlogDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Calendar, Clock, User } from "lucide-react";
import Like from "../Like";
import Comment from "../Comment";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/auth/getBlog/read/${id}`
      );
      setBlog(response.data);
    } catch (err) {
      setError("Failed to fetch blog details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
  }, [id]);

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 items-center justify-center p-4">
        <div className="p-6 max-w-md w-full bg-white/80 backdrop-blur rounded-lg shadow-md">
          <div className="text-lg text-red-600 text-center">
            <p className="font-semibold">Error Loading Blog</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 items-center justify-center p-4">
        <div className="p-6 max-w-md w-full bg-white/80 backdrop-blur rounded-lg shadow-md">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
            <p className="text-slate-600">Loading blog content...</p>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const readingTime = Math.ceil(blog.description.split(" ").length / 200);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-72 sm:h-96 overflow-hidden">
            <img
              src={blog.imageUrl || "/api/placeholder/800/600"}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h1 className="absolute bottom-6 left-6 right-6 text-2xl sm:text-4xl font-bold text-white leading-tight">
              {blog.title}
            </h1>
          </div>

          {/* Meta Information */}
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min read</span>
              </div>
              {blog.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{blog.author}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 py-8">
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                {blog.description}
              </p>
            </div>
          </div>

          {/* Like and Comment Section */}
          <div className="px-6 sm:px-8 py-8">
            <Like blogPostId={id} />
            <Comment blogPostId={id} />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-500">
                {blog.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100">
                    {blog.category}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {/* Add social sharing buttons here if needed */}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetails;
