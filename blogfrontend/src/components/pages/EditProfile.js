import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('No bio added yet.');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch current user data
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/auth/user-details', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.userName);
          setEmail(data.email);
          if (data.bio) setBio(data.bio);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  // Fetch current profile image
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/auth/profile-image/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const blob = await response.blob();
          setPreviewImage(URL.createObjectURL(blob));
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    if (username) {
      fetchProfileImage();
    }
  }, [username]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      // Update profile data
      const profileResponse = await fetch('http://localhost:8080/api/auth/edit', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: username, email, bio }),
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to update profile');
      }

      // Upload image if selected
      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const imageResponse = await fetch('http://localhost:8080/api/auth/upload-profile-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!imageResponse.ok) {
          throw new Error('Failed to upload image');
        }
      }

      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        
        <div className="mb-6 flex justify-center">
          <div className="relative w-32 h-32">
            <input
              type="file"
              id="profile-image"
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <label
              htmlFor="profile-image"
              className="cursor-pointer block w-full h-full rounded-full overflow-hidden border-2 border-blue-500"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Add Photo</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="bio" className="block font-medium mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md w-full"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;