import express from 'express';
import { body, validationResult } from 'express-validator';
import CommentModel from '../models/Comment.js';
import BlogModel from '../models/Blog.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get comments for a blog
router.get('/blog/:blogId', async (req, res) => {
  try {
    const comments = await CommentModel.find({
      blog: req.params.blogId,
      isDeleted: false,
      parentComment: null
    })
    .populate('user', 'username firstName lastName avatar')
    .sort({ createdAt: -1 });
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add comment
router.post('/', protect, [
  body('blogId').notEmpty(),
  body('content').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }
    const { blogId, content, parentCommentId } = req.body;
    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    const commentData = {
      blog: blogId,
      user: req.user._id,
      content
    };
    if (parentCommentId) {
      commentData.parentComment = parentCommentId;
    }
    const comment = await CommentModel.create(commentData);
    const populatedComment = await comment.populate('user', 'username firstName lastName avatar');
    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update comment
router.put('/:id', protect, [
  body('content').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    comment.content = req.body.content;
    await comment.save();
    const updatedComment = await comment.populate('user', 'username firstName lastName avatar');
    res.json({ success: true, data: updatedComment });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete comment
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    comment.isDeleted = true;
    await comment.save();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Like/Unlike comment
router.post('/:id/like', protect, async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }
    const likeIndex = comment.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
    } else {
      comment.likes.push(req.user._id);
    }
    await comment.save();
    res.json({ success: true, data: { likes: comment.likes.length, isLiked: likeIndex === -1 } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router; 