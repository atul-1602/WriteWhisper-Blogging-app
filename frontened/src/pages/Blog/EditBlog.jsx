import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Eye, ArrowLeft, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const EditBlog = () => {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      const blog = response.data.data;
      
      setFormData({
        title: blog.title || '',
        content: blog.content || '',
        excerpt: blog.excerpt || '',
        category: blog.category || '',
        tags: blog.tags ? blog.tags.join(', ') : '',
        coverImage: blog.coverImage || '',
        status: blog.status || 'draft'
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load blog');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await api.put(`/blogs/${id}`, blogData);
      toast.success('Blog updated successfully!');
      navigate(`/blog/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update blog');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto mb-4 animate-spin text-primary-600" />
          <p className="text-secondary-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-ghost"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-3xl font-bold text-secondary-900">
                  Edit Blog
                </h1>
                <p className="text-secondary-600">
                  Update your blog post
                </p>
              </div>
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
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="Enter blog title"
              required
            />
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
              className="textarea"
              placeholder="Brief description of your blog"
              rows="3"
            />
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

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
          </div>

          {/* Tags */}
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
            <p className="text-sm text-secondary-500 mt-1">
              Separate tags with commas
            </p>
          </div>

          {/* Content */}
          <div className="card p-6">
            <label htmlFor="content" className="block text-sm font-medium text-secondary-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="textarea"
              placeholder="Write your blog content here..."
              rows="15"
              required
            />
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
              disabled={saving}
              className="btn-primary"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default EditBlog; 