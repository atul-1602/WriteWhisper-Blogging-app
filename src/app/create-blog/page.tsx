'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  X, 
  BookOpen,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import api from '../../services/api';

interface Category {
  _id: string;
  name: string;
  color: string;
}

const CreateBlog = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    coverImage: '',
    readTime: 5,
    featured: false
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length < 20) {
      newErrors.excerpt = 'Excerpt must be at least 20 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 100) {
      newErrors.content = 'Content must be at least 100 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.readTime < 1) {
      newErrors.readTime = 'Read time must be at least 1 minute';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    try {
      const response = await api.post('/blogs', formData);
      
      if (response.data.success) {
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      console.error('Error creating blog:', error);
      const errorResponse = error as { response?: { data?: { error?: string } } };
      const message = errorResponse?.response?.data?.error || 'Failed to create blog';
      setErrors({ submit: message });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setFormData(prev => ({
      ...prev,
      content,
      readTime: calculateReadTime(content)
    }));
    
    if (errors.content) {
      setErrors(prev => ({
        ...prev,
        content: ''
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo purposes, we'll use a placeholder image
      // In production, you'd upload to Cloudinary or similar service
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          coverImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverImage = () => {
    setFormData(prev => ({
      ...prev,
      coverImage: ''
    }));
  };

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
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center text-secondary-600 hover:text-primary-600 transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
                <div className="w-px h-6 bg-secondary-300"></div>
                <div>
                  <h1 className="text-3xl font-bold text-secondary-900">
                    Create New Blog
                  </h1>
                  <p className="text-secondary-600">
                    Share your thoughts with the world
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`btn-outline btn-sm ${previewMode ? 'bg-primary-50 text-primary-600' : ''}`}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
                <button
                  type="submit"
                  form="blog-form"
                  disabled={saving}
                  className="btn-primary btn-lg"
                >
                  {saving ? (
                    <div className="flex items-center">
                      <div className="spinner w-4 h-4 mr-2"></div>
                      Publishing...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Publish Blog
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <motion.form
                id="blog-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Title */}
                <div className="card p-6">
                  <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
                    Blog Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input text-2xl font-bold ${errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your blog title..."
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Excerpt */}
                <div className="card p-6">
                  <label htmlFor="excerpt" className="block text-sm font-medium text-secondary-700 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    className={`input ${errors.excerpt ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Write a brief summary of your blog..."
                  />
                  {errors.excerpt && (
                    <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
                  )}
                </div>

                {/* Content */}
                <div className="card p-6">
                  <label htmlFor="content" className="block text-sm font-medium text-secondary-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleContentChange}
                    rows={20}
                    className={`input font-serif ${errors.content ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Write your blog content here..."
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                  )}
                </div>

                {errors.submit && (
                  <div className="card p-4 bg-red-50 border border-red-200">
                    <p className="text-red-600">{errors.submit}</p>
                  </div>
                )}
              </motion.form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Cover Image */}
                <div className="card p-6">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Cover Image
                  </label>
                  {formData.coverImage ? (
                    <div className="relative">
                      <img
                        src={formData.coverImage}
                        alt="Cover"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeCoverImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                      <p className="text-sm text-secondary-600 mb-2">Upload cover image</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="cover-image"
                      />
                      <label
                        htmlFor="cover-image"
                        className="btn-outline btn-sm cursor-pointer"
                      >
                        Choose Image
                      </label>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="card p-6">
                  <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`input ${errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Read Time */}
                <div className="card p-6">
                  <label htmlFor="readTime" className="block text-sm font-medium text-secondary-700 mb-2">
                    Read Time (minutes)
                  </label>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-secondary-400" />
                    <input
                      id="readTime"
                      name="readTime"
                      type="number"
                      min="1"
                      value={formData.readTime}
                      onChange={handleChange}
                      className={`input w-20 ${errors.readTime ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                    />
                    <span className="text-secondary-600">minutes</span>
                  </div>
                  {errors.readTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.readTime}</p>
                  )}
                </div>

                {/* Featured */}
                <div className="card p-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-secondary-700">
                      Mark as featured
                    </span>
                  </label>
                </div>

                {/* Preview */}
                {previewMode && (
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">Preview</h3>
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-xl font-bold text-secondary-900">{formData.title || 'Your Blog Title'}</h2>
                        <p className="text-secondary-600 mt-2">{formData.excerpt || 'Your blog excerpt...'}</p>
                      </div>
                      {formData.coverImage && (
                        <img
                          src={formData.coverImage}
                          alt="Cover"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex items-center space-x-4 text-sm text-secondary-500">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{formData.category ? categories.find(c => c._id === formData.category)?.name : 'Category'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formData.readTime} min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CreateBlog; 