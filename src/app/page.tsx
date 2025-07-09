'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  BookOpen,
  Users,
  PenTool
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

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

const Home = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsResponse, categoriesResponse] = await Promise.all([
          api.get('/blogs?featured=true&limit=6'),
          api.get('/categories')
        ]);

        setFeaturedBlogs(blogsResponse.data.data);
        setCategories(categoriesResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { icon: BookOpen, label: 'Blogs Published', value: '1,234+' },
    { icon: Users, label: 'Active Writers', value: '567+' },
    { icon: Eye, label: 'Monthly Views', value: '89K+' },
    { icon: Heart, label: 'Likes Given', value: '12K+' },
  ];

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 lg:py-32 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-accent-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-200 to-primary-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-white/20 mb-8">
                <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-secondary-600">Join thousands of writers sharing their stories</span>
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6 leading-tight">
              <span>Share Your <span className="gradient-text whitespace-nowrap">Thoughts</span></span>
              <span className="block text-secondary-900">With the World</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of writers sharing their knowledge, stories, and insights.
              Create, connect, and inspire through the power of words.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="btn-primary btn-lg group shadow-soft hover:shadow-medium"
                >
                  <span className="inline-flex items-center">
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="btn-primary btn-lg group shadow-soft hover:shadow-medium"
                >
                  <span className="inline-flex items-center">
                    Start Writing
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </Link>
              )}
              <Link
                href="/search"
                className="btn-outline btn-lg group"
              >
                Explore Blogs
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-white via-secondary-50 to-white">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-110">
                    <stat.icon className="w-10 h-10 text-primary-600" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary-200 to-accent-200 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                </div>
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-secondary-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-br from-secondary-50 via-white to-primary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Discover content that matches your interests across various topics and themes.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {categories.slice(0, 8).map((category) => (
              <motion.div
                key={category._id}
                variants={itemVariants}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="card-hover p-6 text-center group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div
                      className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-110"
                      style={{ backgroundColor: category.color + '20', color: category.color }}
                    >
                      <PenTool className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                      {category.name}
                    </h3>
                    <p className="text-sm text-secondary-600 font-medium">
                      {category.blogCount} blogs
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-16 bg-gradient-to-br from-white via-secondary-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Featured Stories
              </h2>
              <p className="text-secondary-600">
                Handpicked stories from our community of writers
              </p>
            </div>
            <Link
              href="/search"
              className="btn-outline group shadow-soft hover:shadow-medium rounded-full p-2"
            >
              <span className="inline-flex items-center">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredBlogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="block"
              >
                <motion.article
                  variants={itemVariants}
                  className="card-hover group h-full relative overflow-hidden"
                >
                  {blog.coverImage && (
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  <div className="p-6 relative">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="badge-primary">
                        {blog.category.name}
                      </span>
                      {blog.featured && (
                        <span className="badge-accent inline-flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                      
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2 leading-tight">
                      {blog.title}
                    </h3>
                    <p className="text-secondary-600 mb-4 line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-secondary-500">
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
                          <span>{blog.likeCount || blog.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{blog.commentCount || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-secondary-200">
                      <div className="flex items-center space-x-3">
                        <img
                          src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.firstName}+${blog.author?.lastName}&background=3b82f6&color=fff`}
                          alt={blog.author?.firstName}
                          className="w-8 h-8 rounded-full ring-2 ring-secondary-200"
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
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/90 to-accent-600/90"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our community of writers and start sharing your knowledge, experiences, and insights with readers around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="btn bg-white text-primary-600 hover:bg-secondary-50 btn-lg shadow-soft hover:shadow-medium group"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="btn bg-white text-primary-600 hover:bg-secondary-50 btn-lg shadow-soft hover:shadow-medium group"
                >
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              )}
              <Link
                href="/search"
                className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600 btn-lg shadow-soft hover:shadow-medium group"
              >
                Explore More
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
