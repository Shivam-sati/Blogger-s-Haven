import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import blogImage from '../Assests/alok.png'; // Adjust the path to your default image
import "./UserBlogs.css"; // Import custom CSS for additional styling

const UserBlogs = () => {
  const { userId } = useParams(); // Get userId from route params
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // To handle any errors
  const navigate = useNavigate();

  const handleReadMore = (id) => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth) {
      navigate(`/read/${id}`); // Pass the ObjectId directly
    } else {
      alert("Please Login/Signup");
      navigate("/"); // Redirect to login page
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`http://localhost:8080/api/auth/delete-blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (err) {
      console.error("Error deleting blog:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const token = localStorage.getItem("token");

        // Step 1: Fetch User's Blog Post Entities
        const userResponse = await fetch(`http://localhost:8080/admin/user/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Add the token in the Authorization header
          },
        });

        // Check if response is OK
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();

        if (userData.blogPostEntities) {
          const blogIds = userData.blogPostEntities.map((blog) => blog.id);

          // Step 2: Fetch Blogs using Blog IDs
          const blogsResponse = await fetch(`http://localhost:8080/admin/userBlogs?ids=${blogIds.join(",")}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Add the token in the Authorization header
            },
          });

          if (!blogsResponse.ok) {
            throw new Error("Failed to fetch blogs");
          }

          const blogsData = await blogsResponse.json();
          setBlogs(blogsData);
        }
      } catch (error) {
        setError(error.message); // Handle error and display message
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };

    fetchUserBlogs();
  }, [userId]);

  if (loading) return <p>Loading blogs...</p>;

  return (
    <div className="container mt-6">
      <h1 className="mb-4 text-center text-dark">User Blogs</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {blogs.length === 0 && !error && <p className="text-center">No blogs found.</p>}
      <div className="row justify-content-center">
        {blogs.map((blog, index) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={index}>
            <div className="card border-secondary shadow-sm border-dark rounded">
              <div className="card-header mb-2 text-muted text-uppercase">{blog.type}</div>
              <div className="card-body text-dark">
                {blog.imageUrl ? (
                  <img
                    src={blog.imageUrl}
                    alt="Blog"
                    className="card-img-top mb-3"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={blogImage}
                    alt="Blog"
                    className="card-img-top mb-3"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <h5 className="card-title font-weight-bold text-capitalize">{blog.title}</h5>
                <p className="card-text text-secondary">
                  {blog.description.length > 150 ? `${blog.description.substring(0, 150)}...` : blog.description}
                </p>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3 border-top">
                <button onClick={() => handleReadMore(blog.id)} className="btn btn-outline-dark ms-3">
                  Read More
                </button>
                <button onClick={() => handleDeleteBlog(blog.id)} className="btn btn-outline-danger ms-3">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBlogs;