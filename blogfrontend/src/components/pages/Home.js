// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Like from "../Like";
import Comment from "../Comment"; // Imported for potential future use
// (We use a modal here, so the modal code handles comments separately)

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Modal state for comments
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [commentText, setCommentText] = useState("");

  const categories = [
    { id: "all", label: "All Posts" },
    { id: "technology", label: "Technology" },
    { id: "health", label: "Health" },
    { id: "travel", label: "Travel" },
    { id: "lifestyle", label: "Lifestyle" },
  ];

  useEffect(() => {
    fetchBlogs();
  }, [activeCategory]);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const url =
        activeCategory === "all"
          ? "http://localhost:8080/api/auth/getAll"
          : `http://localhost:8080/api/auth/blogs/type/${activeCategory}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch blogs");
      const data = await response.json();
      const blogsWithDefaults = data.map((blog) => ({
        ...blog,
        liked: blog.liked || false,
        likeCount: blog.likeCount || 0,
      }));
      setBlogs(blogsWithDefaults);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadMore = (id) => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth) {
      navigate(`/read/${id}`);
    } else {
      alert("Please Login/Signup");
      navigate("/login");
    }
  };

  const openCommentModal = (blogId) => {
    setSelectedBlogId(blogId);
    setIsCommentModalOpen(true);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/auth/add-comment?blogPostId=${selectedBlogId}&commentText=${encodeURIComponent(
          commentText
        )}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        setCommentText("");
        setIsCommentModalOpen(false);
        // Optionally, refresh blogs if you want to update a comment count
        fetchBlogs();
      } else {
        console.error("Failed to add comment");
      }
    } catch (err) {
      console.error("Error adding comment", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-full w-72 bg-white bg-opacity-90 backdrop-blur-lg shadow-lg z-10">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="ml-72 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Browse Categories
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    activeCategory === category.id
                      ? "bg-indigo-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl shadow-md mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent shadow-md"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-md">
              <p className="text-2xl text-gray-600 font-medium">
                No blogs available in this category yet.
              </p>
              <p className="text-gray-500 mt-2">
                Check back later for new content!
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-1"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={blog.imageUrl || "/api/placeholder/400/300"}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-2 text-sm font-medium bg-white bg-opacity-90 text-indigo-600 rounded-full shadow-md">
                        {blog.type}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-sm text-gray-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {new Date(blog.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-indigo-600 transition-colors">
                      {blog.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {blog.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <img
                          src={blog.authorAvatar || "/api/placeholder/32/32"}
                          alt={blog.author}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {blog.author}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Like blogPostId={blog.id} />
                        <button
                          onClick={() => handleReadMore(blog.id)}
                          className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600 rounded-lg transition-colors duration-300"
                        >
                          Read More
                        </button>
                        <button
                          onClick={() => openCommentModal(blog.id)}
                          className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-white hover:bg-indigo-600 border border-indigo-600 rounded-lg transition-colors duration-300"
                        >
                          Comment
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {blog.likeCount} {blog.likeCount === 1 ? "Like" : "Likes"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Comment Modal */}
      {isCommentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Add Comment</h2>
              <button
                onClick={() => setIsCommentModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {/* Here you can either integrate the Comment component directly, or recreate its textarea */}
              <textarea
                placeholder="Write your comment..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAddComment}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Home;
