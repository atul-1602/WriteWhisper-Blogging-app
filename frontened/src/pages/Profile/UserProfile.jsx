import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Calendar, BookOpen, Users } from 'lucide-react';
import api from '../../services/api';

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/users/${username}`);
      setUser(response.data.data.user);
      setBlogs(response.data.data.blogs);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            User not found
          </h1>
          <p className="text-secondary-600">
            The user you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 border-b border-secondary-200">
            <div className="flex items-center space-x-6">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=3b82f6&color=fff`}
                alt={user.firstName}
                className="w-20 h-20 rounded-full"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-secondary-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-secondary-600">@{user.username}</p>
                {user.bio && (
                  <p className="text-secondary-600 mt-2">{user.bio}</p>
                )}
                
                <div className="flex items-center space-x-6 mt-4 text-sm text-secondary-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{blogs.length} blogs</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{user.followerCount} followers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blogs */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              Recent Blogs
            </h2>
            
            {blogs.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  No blogs yet
                </h3>
                <p className="text-secondary-600">
                  This user hasn't published any blogs yet.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="border border-secondary-200 rounded-lg p-6 hover:bg-secondary-50 transition-colors duration-200"
                  >
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-secondary-600 mb-4">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-secondary-500">
                      <span className="badge-primary">
                        {blog.category}
                      </span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile; 