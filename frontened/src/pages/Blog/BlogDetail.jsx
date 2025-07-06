import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Clock, 
  Eye,
  User,
  Calendar,
  Send,
  Trash2,
  Edit,
  ArrowLeft,
  Tag,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const BlogDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (blog?._id) {
      fetchComments();
    }
  }, [blog?._id]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      if (response.data.success) {
        setBlog(response.data.data);
      } else {
        toast.error('Failed to load blog');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/blog/${blog._id}`);
      if (response.data.success) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like this blog');
      return;
    }

    try {
      const response = await api.post(`/blogs/${blog._id}/like`);
      if (response.data.success) {
        setBlog(prev => ({
          ...prev,
          likes: response.data.data.isLiked ? 
            [...prev.likes, { user: user._id }] :
            prev.likes.filter(like => like.user !== user._id)
        }));
        toast.success(response.data.data.isLiked ? 'Blog liked!' : 'Blog unliked!');
      }
    } catch (error) {
      console.error('Error liking blog:', error);
      toast.error('Failed to like blog');
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark this blog');
      return;
    }

    try {
      const response = await api.post(`/blogs/${blog._id}/bookmark`);
      if (response.data.success) {
        setBlog(prev => ({
          ...prev,
          bookmarks: response.data.data.isBookmarked ? 
            [...prev.bookmarks, user._id] :
            prev.bookmarks.filter(id => id !== user._id)
        }));
        toast.success(response.data.data.isBookmarked ? 'Blog bookmarked!' : 'Blog removed from bookmarks!');
      }
    } catch (error) {
      console.error('Error bookmarking blog:', error);
      toast.error('Failed to bookmark blog');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await api.post('/comments', {
        blogId: blog._id,
        content: newComment
      });
      if (response.data.success) {
        setComments(prev => [response.data.data, ...prev]);
        setNewComment('');
        toast.success('Comment added successfully!');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      if (response.data.success) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
        toast.success('Comment deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const isLiked = blog?.likes?.some(like => like.user === user?._id);
  const isBookmarked = blog?.bookmarks?.includes(user?._id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-6 border-4 border-primary-200 border-t-primary-600"></div>
          <p className="text-lg text-secondary-600 font-medium">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-900 mb-4">
            Blog not found
          </h1>
          <p className="text-lg text-secondary-600 mb-6">
            The blog you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            to="/search" 
            className="inline-flex items-center text-secondary-600 hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm"
        >
          {/* Cover Image */}
          {blog.coverImage && (
            <div className="aspect-video overflow-hidden">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="badge-primary text-sm font-medium">
                  {blog.category}
                </span>
                {blog.featured && (
                  <span className="badge-accent text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-secondary-900 mb-4 leading-tight">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="text-xl text-secondary-600 mb-6 leading-relaxed">
                  {blog.excerpt}
                </p>
              )}

              {/* Author Info */}
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={blog.author?.avatar || `https://ui-avatars.com/api/?name=${blog.author?.firstName}+${blog.author?.lastName}&background=3b82f6&color=fff&size=48`}
                  alt={blog.author?.firstName}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                />
                <div>
                  <div className="font-semibold text-secondary-900">
                    {blog.author?.firstName} {blog.author?.lastName}
                  </div>
                  <div className="text-sm text-secondary-500">
                    @{blog.author?.username}
                  </div>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center space-x-6 text-sm text-secondary-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{Math.ceil(blog.content.length / 200)} min read</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{blog.views || 0} views</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none prose-custom mb-8">
              <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-secondary-700">
                {blog.content}
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-secondary-500" />
                  <h3 className="text-sm font-semibold text-secondary-700">
                    Tags:
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="badge-secondary text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-secondary-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isLiked 
                      ? 'text-red-600 bg-red-50 border border-red-200' 
                      : 'text-secondary-600 hover:text-red-600 hover:bg-red-50 border border-transparent'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{blog.likes?.length || 0}</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 border border-transparent transition-all duration-200">
                  <MessageCircle className="w-5 h-5" />
                  <span>{comments.length}</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isBookmarked 
                      ? 'text-primary-600 bg-primary-50 border border-primary-200' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50 border border-transparent'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>Bookmark</span>
                </button>
              </div>

              <button 
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-secondary-600 hover:text-primary-600 hover:bg-primary-50 border border-transparent transition-all duration-200"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </motion.article>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card shadow-lg border-0 bg-white/80 backdrop-blur-sm"
        >
          <div className="p-6 border-b border-secondary-200">
            <h2 className="text-xl font-semibold text-secondary-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comments ({comments.length})
            </h2>
          </div>

          {/* Add Comment */}
          {isAuthenticated ? (
            <div className="p-6 border-b border-secondary-200">
              <form onSubmit={handleAddComment} className="space-y-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=3b82f6&color=fff&size=40`}
                    alt={user?.firstName}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts on this blog..."
                      className="textarea w-full resize-none"
                      rows="3"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={commentLoading || !newComment.trim()}
                        className="btn-primary btn-sm"
                      >
                        {commentLoading ? (
                          <div className="spinner w-4 h-4"></div>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-1" />
                            Post Comment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-6 border-b border-secondary-200 text-center">
              <p className="text-secondary-600 mb-3">
                Please login to leave a comment
              </p>
              <Link to="/login" className="btn-primary btn-sm">
                Login to Comment
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="p-6">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-600 text-lg">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <motion.div 
                    key={comment._id} 
                    className="flex space-x-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <img
                      src={comment.user?.avatar || `https://ui-avatars.com/api/?name=${comment.user?.firstName}+${comment.user?.lastName}&background=3b82f6&color=fff&size=40`}
                      alt={comment.user?.firstName}
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold text-secondary-900">
                              {comment.user?.firstName} {comment.user?.lastName}
                            </span>
                            <span className="text-sm text-secondary-500 ml-2">
                              @{comment.user?.username}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-secondary-500">
                              {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            {isAuthenticated && comment.user?._id === user?._id && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-red-600 hover:text-red-700 transition-colors duration-200"
                                title="Delete comment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-secondary-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogDetail; 