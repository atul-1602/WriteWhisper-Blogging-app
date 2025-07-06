import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    coverImage: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await api.post('/blogs', blogData);
      toast.success('Blog created successfully!');
      navigate(`/blog/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="btn-ghost"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                Create New Blog
              </h1>
              <p className="text-secondary-600">
                Share your thoughts and knowledge with the world
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Title */}
          <div className="card p-6">
            <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-2">
              Blog Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input text-xl font-semibold"
              placeholder="Enter your blog title..."
              required
            />
          </div>

          {/* Cover Image */}
          <div className="card p-6">
            <label htmlFor="coverImage" className="block text-sm font-medium text-secondary-700 mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="input"
              placeholder="https://example.com/image.jpg"
            />
            {formData.coverImage && (
              <div className="mt-4">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="card p-6">
              <label htmlFor="tags" className="block text-sm font-medium text-secondary-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input"
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-xs text-secondary-500 mt-1">
                Separate tags with commas
              </p>
            </div>
          </div>

          {/* Excerpt */}
          <div className="card p-6">
            <label htmlFor="excerpt" className="block text-sm font-medium text-secondary-700 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="3"
              className="textarea"
              placeholder="A brief summary of your blog post..."
              maxLength="300"
            />
            <p className="text-xs text-secondary-500 mt-1">
              {formData.excerpt.length}/300 characters
            </p>
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
              onChange={handleChange}
              rows="15"
              className="textarea font-serif"
              placeholder="Write your blog content here... You can use markdown formatting."
              required
            />
            <p className="text-xs text-secondary-500 mt-1">
              Supports markdown formatting
            </p>
          </div>

          {/* Status */}
          <div className="card p-6">
            <label htmlFor="status" className="block text-sm font-medium text-secondary-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="spinner w-4 h-4 mr-2"></div>
                  Creating...
                </div>
              ) : (
                <div className="flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  {formData.status === 'published' ? 'Publish Blog' : 'Save Draft'}
                </div>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateBlog; 