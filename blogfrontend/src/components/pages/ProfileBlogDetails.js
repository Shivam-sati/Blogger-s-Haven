import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


const ProfileBlogDetails = () => {
    const { id } = useParams();
    console.log("useParams output:", useParams());
    console.log("Extracted ID:", id);
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogDetails();
    }, []);

    const fetchBlogDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Authentication token not found");
            const response = await fetch(`http://localhost:8080/api/auth/getBlog/profile/${id}`,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch blog details");
            }
            const data = await response.json();
            setBlog(data);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container mt-4">
            {error && <div className="alert alert-danger">{error}</div>}
            {blog ? (
                <div className="card border-secondary shadow-sm border-dark rounded">
                    <h5 className="card-header mb-2 text-muted text-uppercase">{blog.type}</h5>
                    <div className="card-body text-dark">
                        <h3 className="card-title font-weight-bold text-capitalize">{blog.title}</h3>
                        <p className="card-text text-secondary">{blog.description}</p>
                        <button className="btn btn-dark mt-3" onClick={() => navigate("/dashboard")}>
                            Back to Home
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center">Loading...</p>
            )}
        </div>
    );
};

export default ProfileBlogDetails;
