'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  BookOpen,
  Share2,
  Bookmark,
  Tag,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import api from '../../../services/api';

interface Blog {
  _id: string;
  title: string;
  content: string;
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
  createdAt: string;
  tags: string[];
  author?: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
  };
}

const BlogDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const fetchBlog = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/blogs/${slug}`);
      setBlog(response.data);
      
      // Check if user has liked/bookmarked this blog
      if (response.data.isLiked) setIsLiked(true);
      if (response.data.isBookmarked) setIsBookmarked(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load blog';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = async () => {
    if (!blog) return;
    
    try {
      if (isLiked) {
        await api.delete(`/blogs/${blog._id}/like`);
        setBlog(prev => prev ? { ...prev, likeCount: prev.likeCount - 1 } : null);
      } else {
        await api.post(`/blogs/${blog._id}/like`);
        setBlog(prev => prev ? { ...prev, likeCount: prev.likeCount + 1 } : null);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBookmark = async () => {
    if (!blog) return;
    
    try {
      if (isBookmarked) {
        await api.delete(`/blogs/${blog._id}/bookmark`);
      } else {
        await api.post(`/blogs/${blog._id}/bookmark`);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleShare = async (platform: string) => {
    if (!blog) return;
    
    const url = window.location.href;
    const title = blog.title;
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    };
    
    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
    
    setShowShareMenu(false);
  };

  const copyToClipboard = async () => {
    if (!blog) return;
    
    try {
      await navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
    
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">Blog Not Found</h1>
          <p className="text-secondary-600 mb-6">{error || 'The blog you&apos;re looking for doesn&apos;t exist.'}</p>
          <Link href="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="container-custom py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="flex items-center text-secondary-600 hover:text-primary-600 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookmark}
                  className={`p-2 rounded-xl transition-colors duration-200 ${
                    isBookmarked 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-100'
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                </motion.button>
                
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-secondary-100 rounded-xl transition-colors duration-200"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                  
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-strong border border-secondary-200/50 z-50"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleShare('twitter')}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 hover:text-primary-600 transition-colors duration-200 w-full text-left"
                        >
                          <span>Share on Twitter</span>
                        </button>
                        <button
                          onClick={() => handleShare('facebook')}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 hover:text-primary-600 transition-colors duration-200 w-full text-left"
                        >
                          <span>Share on Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 hover:text-primary-600 transition-colors duration-200 w-full text-left"
                        >
                          <span>Share on LinkedIn</span>
                        </button>
                        <hr className="my-1 border-secondary-200" />
                        <button
                          onClick={copyToClipboard}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 hover:text-primary-600 transition-colors duration-200 w-full text-left"
                        >
                          <span>Copy Link</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Blog Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            {/* Category and Featured Badge */}
            <div className="flex items-center gap-3 mb-6">
              <Link
                href={`/category/${blog.category?.name?.toLowerCase().replace(/\s+/g, '-') || 'uncategorized'}`}
                className="badge-primary text-sm shadow-soft hover:shadow-medium"
              >
                {blog.category?.name || 'Uncategorized'}
              </Link>
              {blog.featured && (
                <span className="badge-accent text-sm shadow-soft hover:shadow-medium inline-flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Featured
              </span>              
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
              {blog.title || 'Untitled Blog'}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
              {blog.excerpt || 'No excerpt available.'}
            </p>

            {/* Author and Meta Info */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.firstName || 'User'}+${blog.author?.lastName || ''}&background=3b82f6&color=fff`}
                    alt={`${blog.author?.firstName || 'User'} ${blog.author?.lastName || ''}`}
                    className="w-14 h-14 rounded-full ring-3 ring-secondary-200 shadow-soft"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <p className="font-semibold text-secondary-900 text-lg">
                    {blog.author?.firstName || 'Anonymous'} {blog.author?.lastName || ''}
                  </p>
                  <p className="text-sm text-secondary-600">
                    {formatDate(blog.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-secondary-500">
                <div className="flex items-center space-x-2 bg-secondary-50 px-3 py-2 rounded-xl shadow-soft">
                  <Clock className="w-4 h-4 text-primary-600" />
                  <span className="font-medium">{blog.readTime} min read</span>
                </div>
                <div className="flex items-center space-x-2 bg-secondary-50 px-3 py-2 rounded-xl shadow-soft">
                  <Eye className="w-4 h-4 text-primary-600" />
                  <span className="font-medium">{blog.views} views</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cover Image */}
          {blog.coverImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-soft">
                <img
                  src={blog.coverImage}
                  alt={blog.title || 'Blog post'}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </motion.div>
          )}

          {/* Blog Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="prose-custom max-w-none"
          >
            <div 
              className="text-lg leading-relaxed text-secondary-800"
              dangerouslySetInnerHTML={{ __html: blog.content || 'No content available.' }}
            />
          </motion.div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 pt-8 border-t border-secondary-200"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Tag className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-secondary-900">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {blog.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 rounded-xl text-sm font-medium hover:from-primary-100 hover:to-accent-100 transition-all duration-200 shadow-soft hover:shadow-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Engagement Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 pt-8 border-t border-secondary-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isLiked 
                      ? 'text-primary-600 bg-primary-50 shadow-soft' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-secondary-100'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{blog.likeCount} likes</span>
                </motion.button>
                
                <div className="flex items-center space-x-2 px-4 py-2 text-secondary-600">
                  <MessageCircle className="w-5 h-5" />
                  <span>{blog.commentCount} comments</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 text-secondary-600 hover:text-primary-600 hover:bg-secondary-100 rounded-xl transition-colors duration-200"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>Helpful</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                >
                  <ThumbsDown className="w-5 h-5" />
                  <span>Not Helpful</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Author Bio */}
          {blog.author?.bio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 p-6 bg-secondary-50 rounded-2xl"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.firstName || 'User'}+${blog.author?.lastName || ''}&background=3b82f6&color=fff`}
                  alt={`${blog.author?.firstName || 'User'} ${blog.author?.lastName || ''}`}
                  className="w-16 h-16 rounded-full ring-2 ring-secondary-200"
                />
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    About {blog.author?.firstName || 'Anonymous'} {blog.author?.lastName || ''}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {blog.author?.bio || 'No bio available.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage; 