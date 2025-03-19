import React, { useState } from 'react';
import Navbar  from './pages/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import blogImage from '../components/Assests/alok.png'; // Adjust the path to your default image

export const BlogPostPage = () => {
  const navigate = useNavigate();
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setImage(file);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'testing'); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/dmrxftcyv/image/upload', formData);

      if (response.data.secure_url) {
        return response.data.secure_url;
      } else {
        throw new Error('Failed to upload image to Cloudinary');
      }
    } catch (error) {
      console.error('Error in uploadImageToCloudinary:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let imageUrl = blogImage; // Default image
      if (image) {
        try {
          imageUrl = await uploadImageToCloudinary(image);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          setError('Failed to upload image. Please try again.');
          setLoading(false);
          return;
        }
      }

      const blogData = {
        type,
        title,
        description,
        imageUrl,
      };

      const response = await axios.post(
        'http://localhost:8080/api/auth/blog-posting',
        blogData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        alert('Blog post submitted successfully!');
        navigate('/dashboard');
      } else {
        throw new Error('Failed to submit blog post');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setError(error.response?.data || 'An error occurred while submitting the blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar/Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Blog Post</h2>
          {error && (
            <div className="mb-4 text-red-500 text-sm font-medium">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="type" className="block text-gray-700 font-medium mb-1">
                Type:
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                required
              >
                <option value="">Select Type</option>
                <option value="Technology">Technology</option>
                <option value="Health">Health</option>
                <option value="Travel">Travel</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
                Title:
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title (max 60 words)"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
                Description:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your blog description (max 1500 words)"
                rows="8"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="image" className="block text-gray-700 font-medium mb-1">
                Image (optional):
              </label>
              <input
                id="image"
                type="file"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-300"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition duration-300"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Blog'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;