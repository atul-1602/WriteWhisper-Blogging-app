import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon, 
  Filter, 
  Eye, 
  Heart, 
  MessageCircle, 
  Clock, 
  Calendar,
  User,
  TrendingUp,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  const categories = [
    'Technology',
    'Programming',
    'Design',
    'Business',
    'Lifestyle',
    'Travel',
    'Food',
    'Health',
    'Education',
    'Entertainment',
    'Other'
  ];

  useEffect(() => {
    const searchTerm = searchParams.get('search');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    
    // Always load blogs - either filtered by search params or all blogs
    setFilters({
      search: searchTerm || '',
      category: category || '',
      sort: sort || 'newest'
    });
    performSearch(searchTerm || '', category || '', sort || 'newest', 1);
  }, [searchParams]);

  const performSearch = async (search = '', category = '', sort = 'newest', page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (sort) params.append('sort', sort);
      params.append('page', page.toString());
      params.append('limit', '10');

      const response = await api.get(`/blogs/search?${params.toString()}`);
      
      if (response.data.success) {
        setBlogs(response.data.data);
        setPagination(response.data.pagination);
      } else {
        toast.error('Failed to fetch search results');
      }
    } catch (error) {
      console.error('Error searching blogs:', error);
      toast.error(error.response?.data?.error || 'Failed to search blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.sort) params.append('sort', filters.sort);
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.sort) params.append('sort', filters.sort);
    params.append('page', newPage.toString());
    setSearchParams(params);
  };

  const getSortIcon = (sortType) => {
    switch (sortType) {
      case 'popular':
        return <TrendingUp className="w-4 h-4" />;
      case 'views':
        return <Eye className="w-4 h-4" />;
      case 'oldest':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getSortLabel = (sortType) => {
    switch (sortType) {
      case 'popular':
        return 'Most Popular';
      case 'views':
        return 'Most Views';
      case 'oldest':
        return 'Oldest First';
      default:
        return 'Newest First';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-8">
      <div className="container-custom">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-secondary-900 mb-3">
            Discover Amazing Content
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Search through thousands of articles, tutorials, and insights from our community
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="card p-6 mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search for articles, topics, or authors..."
                  className="input pl-12 pr-4 py-3 text-lg border-2 border-secondary-200 focus:border-primary-500 transition-colors duration-200"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-primary px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <SearchIcon className="w-5 h-5 mr-2" />
              Search
            </button>
          </div>
        </motion.form>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-2 mb-6">
            <Filter className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-secondary-900">
              Refine Your Search
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-3">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input border-2 border-secondary-200 focus:border-primary-500 transition-colors duration-200"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-3">
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="input border-2 border-secondary-200 focus:border-primary-500 transition-colors duration-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="views">Most Views</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="text-center py-16">
              <div className="spinner w-16 h-16 mx-auto mb-6 border-4 border-primary-200 border-t-primary-600"></div>
              <p className="text-lg text-secondary-600 font-medium">
                {filters.search || filters.category ? 'Searching for amazing content...' : 'Loading all blogs...'}
              </p>
            </div>
          ) : blogs.length === 0 && (filters.search || filters.category) ? (
            <div className="text-center py-16">
              <SearchIcon className="w-20 h-20 text-secondary-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-secondary-900 mb-3">
                No results found
              </h3>
              <p className="text-secondary-600 text-lg mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setFilters({ search: '', category: '', sort: 'newest' });
                  setSearchParams({});
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Results Header */}
              {blogs.length > 0 && (
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-semibold text-secondary-900">
                      {filters.search || filters.category 
                        ? `${pagination.total} ${pagination.total === 1 ? 'result' : 'results'} found`
                        : `${pagination.total} ${pagination.total === 1 ? 'blog' : 'blogs'} available`
                      }
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 text-secondary-600">
                    {getSortIcon(filters.sort)}
                    <span className="text-sm font-medium">{getSortLabel(filters.sort)}</span>
                  </div>
                </div>
              )}

              {/* Blog Cards */}
              <AnimatePresence>
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-hover p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Blog Image */}
                      {blog.coverImage && (
                        <div className="lg:w-48 lg:flex-shrink-0">
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="w-full h-48 lg:h-32 object-cover rounded-xl shadow-md"
                          />
                        </div>
                      )}
                      
                      {/* Blog Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="badge-primary text-sm font-medium">
                            {blog.category}
                          </span>
                          {blog.featured && (
                            <span className="badge-accent text-sm font-medium">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <Link
                          to={`/blog/${blog._id}`}
                          className="block group"
                        >
                          <h3 className="text-2xl font-bold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                            {blog.title}
                          </h3>
                        </Link>
                        
                        <p className="text-secondary-600 mb-4 line-clamp-3 text-lg leading-relaxed">
                          {blog.excerpt || blog.content.substring(0, 200) + '...'}
                        </p>
                        
                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{Math.ceil(blog.content.length / 200)} min read</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{blog.views || 0} views</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{blog.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{blog.commentCount || 0}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Author Info */}
                        <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                          <div className="flex items-center space-x-3">
                            <img
                              src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.firstName}+${blog.author?.lastName}&background=3b82f6&color=fff&size=40`}
                              alt={blog.author?.firstName}
                              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                            />
                            <div>
                              <div className="font-semibold text-secondary-900">
                                {blog.author?.firstName} {blog.author?.lastName}
                              </div>
                              <div className="text-xs text-secondary-500">
                                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                          
                          <Link
                            to={`/blog/${blog._id}`}
                            className="btn-primary text-sm px-4 py-2"
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center space-x-2 mt-8"
                >
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          pageNum === pagination.page
                            ? 'bg-primary-600 text-white'
                            : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="btn-secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Search; 