import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  BookOpen,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [blogsResponse, statsResponse] = await Promise.all([
        api.get('/blogs/user/me'),
        api.get('/users/stats')
      ]);

      setBlogs(blogsResponse.data.data);
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/blogs/${blogId}`);
        setBlogs(blogs.filter(blog => blog._id !== blogId));
      } catch (error) {
        console.error('Error deleting blog:', error);
      }
    }
  };

  const statsCards = [
    {
      title: 'Total Blogs',
      value: stats.totalBlogs,
      icon: BookOpen,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Published',
      value: stats.publishedBlogs,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Total Likes',
      value: stats.totalLikes,
      icon: Heart,
      color: 'bg-red-500',
      change: '+23%'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-secondary-600">
                Here's what's happening with your blog today.
              </p>
            </div>
            <Link
              to="/create-blog"
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Blog
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-secondary-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Blogs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="p-6 border-b border-secondary-200">
            <h2 className="text-xl font-semibold text-secondary-900">
              Your Recent Blogs
            </h2>
          </div>
          
          <div className="p-6">
            {blogs.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  No blogs yet
                </h3>
                <p className="text-secondary-600 mb-6">
                  Start writing your first blog post to share your thoughts with the world.
                </p>
                <Link
                  to="/create-blog"
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Blog
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-secondary-900 mb-1">
                        {blog.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-secondary-500">
                        <span className="badge-primary">
                          {blog.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{blog.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{blog.likeCount}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{blog.commentCount}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="btn-ghost btn-sm"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/edit-blog/${blog._id}`}
                        className="btn-ghost btn-sm"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="btn-ghost btn-sm text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">
              Create New Blog
            </h3>
            <p className="text-secondary-600 mb-4">
              Start writing your next blog post
            </p>
            <Link to="/create-blog" className="btn-primary btn-sm">
              Get Started
            </Link>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">
              View Analytics
            </h3>
            <p className="text-secondary-600 mb-4">
              Check your blog performance
            </p>
            <Link to="/analytics" className="btn-outline btn-sm">
              View Stats
            </Link>
          </div>

          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-secondary-900 mb-2">
              Manage Profile
            </h3>
            <p className="text-secondary-600 mb-4">
              Update your profile settings
            </p>
            <Link to="/profile" className="btn-outline btn-sm">
              Edit Profile
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 