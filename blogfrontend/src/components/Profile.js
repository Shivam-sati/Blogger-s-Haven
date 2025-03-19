import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  Navbar  from './pages/Navbar';
import { MoreVertical } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication token not found');

        const [postsResponse, userResponse] = await Promise.all([
          fetch('http://localhost:8080/api/auth/myblogs', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch('http://localhost:8080/api/auth/user-details', {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        if (!postsResponse.ok || !userResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [postsData, userData] = await Promise.all([
          postsResponse.json(),
          userResponse.json(),
        ]);

        setPosts(postsData.reverse());
        setUsername(userData.userName);
        setBio(userData.bio);

        // Fetch profile image after getting username
        if (userData.userName) {
          const imageResponse = await fetch(
            `http://localhost:8080/api/auth/profile-image/${userData.userName}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (imageResponse.ok) {
            const blob = await imageResponse.blob();
            setProfileImage(URL.createObjectURL(blob));
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function for profile image URL
    return () => {
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`http://localhost:8080/api/auth/delete-blog/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts(posts.filter(post => post.id !== id));
      setMenuVisible(null);
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err.message);
    }
  };

  const truncateDescription = (description) => {
    const maxLength = 150;
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="lg:ml-72">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Navbar />
        <div className="lg:ml-72">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg text-red-600">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      
      {/* Main content */}
      <div className="lg:ml-72">
        <div className="p-4 md:p-8">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
              <div className="relative w-32 h-32 rounded-full border-2 border-blue-500">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Profile</span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{username}</h2>
                <h2 className="text-xl font-semibold mb-2">Bio</h2>
                <p className="text-gray-500">{bio}</p>
              </div>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={() => navigate('/edit_profile')}
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Blog Posts Section */}
          <h2 className="text-2xl font-bold mb-6">Blog Posts</h2>
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md p-6 relative"
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Blog"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h1 className="text-xl font-bold text-gray-800 mb-4">{post.title}</h1>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                </div>
                <div className="text-sm text-gray-500 my-4">
                  Posted on {new Date(post.date).toLocaleDateString()}
                </div>

                <div className="flex justify-between items-center">
                  {post.description.length > 150 && (
                    <button
                      onClick={() => navigate(`/read/profile/${post.id}`)}
                      className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      Read More
                    </button>
                  )}

                  <button
                    onClick={() => setMenuVisible(menuVisible === post.id ? null : post.id)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <MoreVertical className="h-6 w-6" />
                  </button>
                </div>

                {menuVisible === post.id && (
                  <div className="absolute top-12 right-6 bg-white border rounded shadow-lg z-10">
                    <button
                      onClick={() => {
                        setMenuVisible(null);
                        navigate(`/edit/profile/${post.id}`);
                      }}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;