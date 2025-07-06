import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Clock, 
  Eye,
  User,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const BlogDetail = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${slug}`);
      setBlog(response.data.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      // Handle login redirect
      return;
    }

    try {
      await api.post(`/blogs/${blog._id}/like`);
      setBlog(prev => ({
        ...prev,
        likes: prev.isLikedBy ? 
          prev.likes.filter(like => like.user !== user._id) :
          [...prev.likes, { user: user._id }]
      }));
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      // Handle login redirect
      return;
    }

    try {
      await api.post(`/blogs/${blog._id}/bookmark`);
      setBlog(prev => ({
        ...prev,
        bookmarks: prev.isBookmarkedBy ?
          prev.bookmarks.filter(id => id !== user._id) :
          [...prev.bookmarks, user._id]
      }));
    } catch (error) {
      console.error('Error bookmarking blog:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Blog not found
          </h1>
          <p className="text-secondary-600">
            The blog you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom max-w-4xl">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden"
        >
          {/* Cover Image */}
          {blog.coverImage && (
            <div className="aspect-video overflow-hidden">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="badge-primary">
                  {blog.category}
                </span>
                {blog.featured && (
                  <span className="badge-accent">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-secondary-900 mb-4">
                {blog.title}
              </h1>

              <p className="text-xl text-secondary-600 mb-6">
                {blog.excerpt}
              </p>

              {/* Author Info */}
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.firstName}+${blog.author?.lastName}&background=3b82f6&color=fff`}
                  alt={blog.author?.firstName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-medium text-secondary-900">
                    {blog.author?.firstName} {blog.author?.lastName}
                  </div>
                  <div className="text-sm text-secondary-500">
                    @{blog.author?.username}
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center space-x-6 text-sm text-secondary-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTime} min read</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{blog.views} views</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none prose-custom mb-8">
              <div className="whitespace-pre-wrap font-serif">
                {blog.content}
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-secondary-700 mb-2">
                  Tags:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="badge-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-secondary-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    blog.isLikedBy ? 'text-red-600 bg-red-50' : 'text-secondary-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${blog.isLikedBy ? 'fill-current' : ''}`} />
                  <span>{blog.likeCount}</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200">
                  <MessageCircle className="w-5 h-5" />
                  <span>{blog.commentCount}</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    blog.isBookmarkedBy ? 'text-primary-600 bg-primary-50' : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${blog.isBookmarkedBy ? 'fill-current' : ''}`} />
                  <span>Bookmark</span>
                </button>
              </div>

              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogDetail; 