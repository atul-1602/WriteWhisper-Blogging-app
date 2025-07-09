'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import api from '../../services/api';
import Link from 'next/link';

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
  blogCount: number;
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Fetch blogs based on filters
  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      params.append('page', page.toString());
      params.append('limit', pagination.limit.toString());
      params.append('sort', sortBy);

      const response = await api.get(`/blogs?${params.toString()}`);
      setBlogs(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBlogs(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/search${newUrl}`);
  }, [searchQuery, selectedCategory, sortBy, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBlogs(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('newest');
  };

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

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <section className="bg-white border-b border-secondary-200 py-8">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Search Blogs
            </h1>
            <p className="text-secondary-600 max-w-2xl">
              Discover amazing stories, insights, and knowledge from our community of writers. 
              Use filters to find exactly what you&apos;re looking for.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-lg shadow-soft border border-secondary-200 p-6 sticky top-24">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10 w-full"
                  />
                </div>
              </form>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-between w-full mb-4 p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
              >
                <span className="flex items-center text-secondary-700 font-medium">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </span>
                {showFilters ? (
                  <ChevronUp className="w-4 h-4 text-secondary-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-secondary-500" />
                )}
              </button>

              {/* Filters Content */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="input w-full"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="popular">Most Popular</option>
                      <option value="views">Most Views</option>
                    </select>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="input w-full"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name} ({category.blogCount})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Filters */}
                  {(searchQuery || selectedCategory || sortBy !== 'newest') && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center justify-center w-full p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear Filters
                    </button>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-xl font-semibold text-secondary-900">
                  {loading ? 'Loading...' : `${pagination.total} blogs found`}
                </h2>
                {(searchQuery || selectedCategory) && (
                  <p className="text-secondary-600 text-sm mt-1">
                    {searchQuery && `Searching for: "${searchQuery}"`}
                    {searchQuery && selectedCategory && ' • '}
                    {selectedCategory && `Category: ${categories.find(c => c._id === selectedCategory)?.name}`}
                  </p>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-white rounded-lg border border-secondary-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-secondary-600 hover:text-primary-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-secondary-600 hover:text-primary-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="spinner w-8 h-8"></div>
              </div>
            )}

            {/* Results */}
            {!loading && (
              <>
                {blogs.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                      No blogs found
                    </h3>
                    <p className="text-secondary-600 mb-4">
                      Try adjusting your search terms or filters
                    </p>
                    <button
                      onClick={clearFilters}
                      className="btn-primary"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Grid View */}
                    {viewMode === 'grid' && (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        {blogs.map((blog) => (
                          <Link
                            key={blog._id}
                            href={`/blog/${blog.slug}`}
                            className="block"
                          >
                            <motion.article
                              variants={itemVariants}
                              className="bg-white rounded-lg shadow-soft border border-secondary-200 overflow-hidden hover:shadow-medium transition-shadow duration-300 h-full"
                            >
                              {blog.coverImage && (
                                <div className="aspect-video overflow-hidden">
                                  <img
                                    src={blog.coverImage}
                                    alt={blog.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
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
                                  {blog.featured && (
                                    <span className="badge-accent text-xs inline-flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    Featured
                                  </span>                                  
                                  )}
                                </div>
                                <h3 className="text-lg font-semibold text-secondary-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors duration-200">
                                  {blog.title}
                                </h3>
                                <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                                  {blog.excerpt}
                                </p>
                                <div className="flex items-center justify-between text-xs text-secondary-500 mb-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{blog.readTime} min</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Eye className="w-3 h-3" />
                                      <span>{blog.views}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-1">
                                      <Heart className="w-3 h-3" />
                                      <span>{blog.likeCount}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <MessageCircle className="w-3 h-3" />
                                      <span>{blog.commentCount}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3 pt-3 border-t border-secondary-200">
                                  <img
                                    src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.firstName}+${blog.author?.lastName}&background=3b82f6&color=fff`}
                                    alt={blog.author?.firstName}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <div>
                                    <div className="text-xs font-medium text-secondary-900">
                                      {blog.author?.firstName} {blog.author?.lastName}
                                    </div>
                                    <div className="text-xs text-secondary-500">
                                      {formatDate(blog.createdAt)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.article>
                          </Link>
                        ))}
                      </motion.div>
                    )}

                    {/* List View */}
                    {viewMode === 'list' && (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                      >
                        {blogs.map((blog) => (
                          <Link
                            key={blog._id}
                            href={`/blog/${blog.slug}`}
                            className="block"
                          >
                            <motion.article
                              variants={itemVariants}
                              className="bg-white rounded-lg shadow-soft border border-secondary-200 p-6 hover:shadow-medium transition-shadow duration-300"
                            >
                              <div className="flex gap-6">
                                {blog.coverImage && (
                                  <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                      src={blog.coverImage}
                                      alt={blog.title}
                                      className="w-full h-full object-cover"
                                    />
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
                                  <h3 className="text-xl font-semibold text-secondary-900 mb-2 hover:text-primary-600 transition-colors duration-200">
                                    {blog.title}
                                  </h3>
                                  <p className="text-secondary-600 mb-3 line-clamp-2">
                                    {blog.excerpt}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm text-secondary-500">
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
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.firstName}+${blog.author?.lastName}&background=3b82f6&color=fff`}
                                        alt={blog.author?.firstName}
                                        className="w-8 h-8 rounded-full"
                                      />
                                      <div>
                                        <div className="text-sm font-medium text-secondary-900">
                                          {blog.author?.firstName} {blog.author?.lastName}
                                        </div>
                                        <div className="text-xs text-secondary-500">
                                          {formatDate(blog.createdAt)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.article>
                          </Link>
                        ))}
                      </motion.div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                      <div className="flex justify-center mt-8">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => fetchBlogs(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <span className="text-secondary-600">
                            Page {pagination.page} of {pagination.pages}
                          </span>
                          <button
                            onClick={() => fetchBlogs(pagination.page + 1)}
                            disabled={pagination.page === pagination.pages}
                            className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 