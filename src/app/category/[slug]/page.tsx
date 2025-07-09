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
  Grid,
  List,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import api from '../../../services/api';

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
  createdAt: string;
  slug: string;
  author?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  color: string;
  description: string;
  blogCount: number;
}

const CategoryPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchCategory = useCallback(async () => {
    try {
      const response = await api.get(`/categories/${slug}`);
      setCategory(response.data);
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  }, [slug]);

  const fetchBlogs = useCallback(async (page = 1) => {
    if (!category) return;
    
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.set('category', category._id);
      if (sortBy !== 'newest') params.set('sort', sortBy);
      params.set('page', page.toString());
      
      const response = await api.get(`/blogs?${params.toString()}`);
      setBlogs(response.data.blogs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  }, [category, sortBy]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  useEffect(() => {
    if (category) {
      fetchBlogs(1);
    }
  }, [category, fetchBlogs]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">Category Not Found</h1>
          <p className="text-secondary-600 mb-6">The category you&apos;re looking for doesn&apos;t exist.</p>
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
        <div className="container-custom py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Link
                href="/"
                className="flex items-center text-secondary-600 hover:text-primary-600 transition-colors duration-200 mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: category.color + '20', color: category.color }}
              >
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              {category.name}
            </h1>
            
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto mb-6">
              {category.description}
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-secondary-500">
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{pagination.total} blogs</span>
              </div>
              <div className="w-1 h-1 bg-secondary-300 rounded-full"></div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>Trending</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline btn-sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </button>
              
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center space-x-4"
                >
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="views">Most Views</option>
                  </select>
                </motion.div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-secondary-400 hover:text-secondary-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'text-secondary-400 hover:text-secondary-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
            {loading ? 'Loading...' : `${pagination.total} blogs in ${category.name}`}
          </h2>
          <p className="text-secondary-600">
            Discover amazing content in the {category.name.toLowerCase()} category
          </p>
        </motion.div>

        {/* Blogs Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-secondary-200 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-4 bg-secondary-200 rounded mb-2"></div>
                  <div className="h-4 bg-secondary-200 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-secondary-200 rounded mb-4"></div>
                  <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">No blogs yet</h3>
            <p className="text-secondary-600 mb-6">
              Be the first to write a blog in the {category.name} category!
            </p>
              <Link href="/create-blog" className="btn-primary inline-flex items-center rounded-full p-2">
                Write a Blog
              </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "space-y-6"
            }
          >
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="block"
              >
                <motion.article
                  variants={itemVariants}
                  className={viewMode === 'grid' 
                    ? "card-hover group h-full"
                    : "card-hover group flex space-x-6 h-full"
                  }
                >
                  {viewMode === 'grid' ? (
                    <>
                      {blog.coverImage && (
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {blog.featured && (
                            <div className="absolute top-3 left-3">
                              <span className="badge-accent text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Featured
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span 
                            className="badge text-xs"
                            style={{ 
                              backgroundColor: blog.category.color + '20', 
                              color: blog.category.color 
                            }}
                          >
                            {blog.category.name}
                          </span>
                          {blog.featured && !blog.coverImage && (
                            <span className="badge-accent text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-semibold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                          {blog.title}
                        </h3>
                        
                        <p className="text-secondary-600 mb-4 line-clamp-3">
                          {blog.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-secondary-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{blog.readTime} min read</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{blog.views}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
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
                      </div>
                    </>
                  ) : (
                    <>
                      {blog.coverImage && (
                        <div className="relative w-48 h-32 flex-shrink-0">
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {blog.featured && (
                            <div className="absolute top-2 left-2">
                              <span className="badge-accent text-xs">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Featured
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span 
                            className="badge text-xs"
                            style={{ 
                              backgroundColor: blog.category.color + '20', 
                              color: blog.category.color 
                            }}
                          >
                            {blog.category.name}
                          </span>
                          {blog.featured && (
                            <span className="badge-accent text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-2xl font-semibold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                          {blog.title}
                        </h3>
                        
                        <p className="text-secondary-600 mb-4 line-clamp-2">
                          {blog.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-secondary-500">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{blog.readTime} min read</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{blog.views} views</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{blog.likeCount} likes</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{blog.commentCount} comments</span>
                            </div>
                          </div>
                          <span className="text-secondary-400">
                            {formatDate(blog.createdAt)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.article>
              </Link>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex justify-center"
          >
            <div className="flex items-center space-x-2">
              {pagination.currentPage > 1 && (
                <button
                  onClick={() => fetchBlogs(pagination.currentPage - 1)}
                  className="btn-outline btn-sm"
                >
                  Previous
                </button>
              )}
              
              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1;
                const isActive = page === pagination.currentPage;
                const isNearActive = Math.abs(page - pagination.currentPage) <= 1;
                const isFirst = page === 1;
                const isLast = page === pagination.totalPages;
                
                if (isActive || isNearActive || isFirst || isLast) {
                  return (
                    <button
                      key={page}
                      onClick={() => fetchBlogs(page)}
                      className={`btn-sm ${
                        isActive 
                          ? 'btn-primary' 
                          : 'btn-outline'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === pagination.currentPage - 2 || page === pagination.currentPage + 2) {
                  return <span key={page} className="text-secondary-400">...</span>;
                }
                return null;
              })}
              
              {pagination.currentPage < pagination.totalPages && (
                <button
                  onClick={() => fetchBlogs(pagination.currentPage + 1)}
                  className="btn-outline btn-sm"
                >
                  Next
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage; 