import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Eye, Heart, MessageCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Category = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData();
  }, [slug]);

  const fetchCategoryData = async () => {
    try {
      const response = await api.get(`/categories/${slug}`);
      setCategory(response.data.data.category);
      setBlogs(response.data.data.blogs);
    } catch (error) {
      console.error('Error fetching category data:', error);
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

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Category not found
          </h1>
          <p className="text-secondary-600">
            The category you're looking for doesn't exist.
          </p>
        </div>
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
          <div className="flex items-center space-x-4 mb-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: category.color + '20', color: category.color }}
            >
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                {category.name}
              </h1>
              <p className="text-secondary-600">
                {category.description || `Explore ${category.name} blogs`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Blogs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                No blogs in this category yet
              </h3>
              <p className="text-secondary-600">
                Be the first to write a blog in this category!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <motion.article
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-hover group"
                >
                  {blog.coverImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="badge-primary">
                        {blog.category}
                      </span>
                      {blog.featured && (
                        <span className="badge-accent">
                          Featured
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/blog/${blog._id}`}
                      className="block group"
                    >
                      <h3 className="text-xl font-semibold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                        {blog.title}
                      </h3>
                    </Link>
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
                    <div className="mt-4 pt-4 border-t border-secondary-200">
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
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Category; 