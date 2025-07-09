'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Eye, Heart, MessageCircle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import api from '../../services/api';

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  category: {
    _id: string;
    name: string;
    color: string;
  };
  featured: boolean;
  readTime: number;
  views: number;
  likeCount: number;
  commentCount: number;
  likes: Array<{ user: string; createdAt: string }>;
  createdAt: string;
  status: string;
  slug: string;
}

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const [blogsResponse, statsResponse] = await Promise.all([
          api.get('/blogs/my-blogs'),
          api.get('/blogs/my-stats')
        ]);

        setBlogs(blogsResponse.data.data);
        setStats(statsResponse.data.data);
      } catch (error: unknown) {
        console.error('Error fetching dashboard data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">Error Loading Dashboard</h1>
          <p className="text-secondary-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="container-custom">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                  Welcome back, {user?.firstName} {user?.lastName}!
                </h1>
                <p className="text-secondary-600">
                  Here&apos;s what&apos;s happening with your blog
                </p>
              </div>
              <Link
                href="/create-blog"
                className="btn-primary btn-lg inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Write New Blog
              </Link>

            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Total Blogs</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.totalBlogs}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-accent-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Total Views</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.totalViews}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Total Likes</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.totalLikes}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-600">Total Comments</p>
                  <p className="text-2xl font-bold text-secondary-900">{stats.totalComments}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Blogs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card"
          >
            <div className="p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">Your Recent Blogs</h2>
            </div>
            <div className="p-6">
              {blogs.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-secondary-900 mb-2">No blogs yet</h3>
                  <p className="text-secondary-600 mb-6">Start writing your first blog post</p>
                  <Link
                    href="/create-blog"
                    className="btn-primary inline-flex items-center rounded-full p-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Write Your First Blog
                  </Link>

                </div>
              ) : (
                <div className="space-y-6">
                  {blogs.slice(0, 5).map((blog) => (
                    <div key={blog._id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-secondary-50 transition-colors duration-200">
                      {blog.coverImage && (
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-secondary-900 mb-1">{blog.title}</h3>
                        <p className="text-sm text-secondary-600 line-clamp-2">{blog.excerpt}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-secondary-500">
                          <span className="badge-secondary">{blog.category.name}</span>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{blog.readTime || 5} min read</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{blog.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{blog.likeCount || blog.likes?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`badge ${blog.status === 'published' ? 'badge-primary' : 'badge-secondary'}`}>
                          {blog.status}
                        </span>
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="btn-outline btn-sm"
                        >
                          View
                        </Link>
                        <Link
                          href={`/edit-blog/${blog._id}`}
                          className="btn-outline btn-sm"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard; 