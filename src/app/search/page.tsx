'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
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

const SearchPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchBlogs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (selectedCategory) params.set('category', selectedCategory);
      if (sortBy !== 'newest') params.set('sort', sortBy);
      params.set('page', page.toString());
      
      const response = await api.get(`/blogs/search?${params.toString()}`);
      setBlogs(response.data.blogs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, sortBy]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchBlogs(1);
  }, [fetchBlogs]);

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
                          {category?.name || 'Uncategorized'} ({category?.blogCount || 0})
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
                    {selectedCategory && `Category: ${categories.find(c => c._id === selectedCategory)?.name || 'Unknown'}`}
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
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {blogs.map((blog) => (
                          <Link
                            key={blog._id}
                            href={`/blog/${blog.slug || 'untitled'}`}
                            className="block"
                          >
                            <motion.article
                              variants={itemVariants}
                              className="card-hover group h-full min-h-[450px] flex flex-col relative overflow-hidden"
                            >
                              {blog.coverImage && (
                                <div className="aspect-video overflow-hidden relative">
                                  <img
                                    src={blog.coverImage}
                                    alt={blog.title || 'Blog post'}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                              )}
                              <div className="p-6 flex flex-col flex-1 relative">
                                <div className="flex items-center gap-2 mb-3">
                                  <span 
                                    className="badge text-xs"
                                    style={{ 
                                      backgroundColor: blog.category?.color + '20', 
                                      color: blog.category?.color 
                                    }}
                                  >
                                    {blog.category?.name || 'Uncategorized'}
                                  </span>
                                  {blog.featured && (
                                    <span className="badge-accent text-xs inline-flex items-center">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    Featured
                                  </span>                                  
                                  )}
                                </div>
                                <h3 className="text-xl font-semibold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2 leading-tight">
                                  {blog.title || 'Untitled Blog'}
                                </h3>
                                <p className="text-secondary-600 mb-4 line-clamp-3 leading-relaxed">
                                  {blog.excerpt || 'No excerpt available.'}
                                </p>
                                <div className="mt-auto pt-4 border-t border-secondary-200">
                                  <div className="flex items-center justify-between text-sm text-secondary-500 mb-3">
                                    <div className="flex items-center space-x-4">
                                      <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{blog.readTime || 5} min read</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Eye className="w-4 h-4" />
                                        <span>{blog.views}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <div className="flex items-center space-x-1">
                                        <Heart className="w-4 h-4" />
                                        <span>{blog.likeCount || 0}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>{blog.commentCount || 0}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                  <img
                                    src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.firstName || 'User'}+${blog.author?.lastName || ''}&background=3b82f6&color=fff`}
                                    alt={blog.author?.firstName || 'User'}
                                    className="w-8 h-8 rounded-full ring-2 ring-secondary-200"
                                  />
                                  <div>
                                    <div className="text-sm font-medium text-secondary-900">
                                      {blog.author?.firstName || 'Anonymous'} {blog.author?.lastName || ''}
                                    </div>
                                    <div className="text-xs text-secondary-500">
                                      {formatDate(blog.createdAt)}
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
                            href={`/blog/${blog.slug || 'untitled'}`}
                            className="block"
                          >
                            <motion.article
                              variants={itemVariants}
                              className="card-hover group p-6 hover:shadow-medium transition-shadow duration-300"
                            >
                              <div className="flex gap-6">
                                {blog.coverImage && (
                                  <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
                                    <img
                                      src={blog.coverImage}
                                      alt={blog.title || 'Blog post'}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span 
                                      className="badge text-xs"
                                      style={{ 
                                        backgroundColor: blog.category?.color + '20', 
                                        color: blog.category?.color 
                                      }}
                                    >
                                      {blog.category?.name || 'Uncategorized'}
                                    </span>
                                    {blog.featured && (
                                      <span className="badge-accent text-xs">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Featured
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="text-xl font-semibold text-secondary-900 mb-2 hover:text-primary-600 transition-colors duration-200">
                                    {blog.title || 'Untitled Blog'}
                                  </h3>
                                  <p className="text-secondary-600 mb-3 line-clamp-2">
                                    {blog.excerpt || 'No excerpt available.'}
                                  </p>
                                  <div className="flex items-center justify-between pt-3 border-t border-secondary-200">
                                    <div className="flex items-center space-x-4 text-sm text-secondary-500">
                                      <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{blog.readTime || 5} min read</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Eye className="w-4 h-4" />
                                        <span>{blog.views} views</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Heart className="w-4 h-4" />
                                        <span>{blog.likeCount || 0} likes</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>{blog.commentCount || 0} comments</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.firstName || 'User'}+${blog.author?.lastName || ''}&background=3b82f6&color=fff`}
                                        alt={blog.author?.firstName || 'User'}
                                        className="w-8 h-8 rounded-full ring-2 ring-secondary-200"
                                      />
                                      <div>
                                        <div className="text-sm font-medium text-secondary-900">
                                          {blog.author?.firstName || 'Anonymous'} {blog.author?.lastName || ''}
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
                    {pagination.totalPages > 1 && (
                      <div className="flex justify-center mt-8">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => fetchBlogs(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          <span className="text-secondary-600">
                            Page {pagination.currentPage} of {pagination.totalPages}
                          </span>
                          <button
                            onClick={() => fetchBlogs(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
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

const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="spinner w-12 h-12"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage; 