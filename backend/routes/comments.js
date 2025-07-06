import express from 'express';
import { body, validationResult } from 'express-validator';
import CommentModel from '../models/Comment.js';
import BlogModel from '../models/Blog.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get comments for a blog
// @route   GET /api/comments/blog/:blogId
router.get('/blog/:blogId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const comments = await CommentModel.find({
      blog: req.params.blogId,
      isDeleted: false,
      parentComment: null
    })
    .populate('user', 'username firstName lastName avatar')
    .populate({
      path: 'replies',
      match: { isDeleted: false },
      populate: {
        path: 'user',
        select: 'username firstName lastName avatar'
      }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await CommentModel.countDocuments({
      blog: req.params.blogId,
      isDeleted: false,
      parentComment: null
    });

    res.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Add comment
// @route   POST /api/comments
router.post('/', protect, [
  body('blogId').notEmpty().withMessage('Blog ID is required'),
  body('content').notEmpty().withMessage('Comment content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { blogId, content, parentCommentId } = req.body;

    // Check if blog exists
    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Check if comments are allowed
    if (!blog.allowComments) {
      return res.status(400).json({
        success: false,
        error: 'Comments are disabled for this blog'
      });
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

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update comment
// @route   PUT /api/comments/:id
router.put('/:id', protect, [
  body('content').notEmpty().withMessage('Comment content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const comment = await CommentModel.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Check ownership
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this comment'
      });
    }

    comment.content = req.body.content;
    comment.isEdited = true;
    comment.editedAt = new Date();

    await comment.save();
    const updatedComment = await comment.populate('user', 'username firstName lastName avatar');

    res.json({
      success: true,
      data: updatedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    // Check ownership or admin role
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this comment'
      });
    }

    // Soft delete
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    await comment.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Like/Unlike comment
// @route   POST /api/comments/:id/like
router.post('/:id/like', protect, async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found'
      });
    }

    const likeIndex = comment.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
    } else {
      // Like
      comment.likes.push(req.user._id);
    }

    await comment.save();

    res.json({
      success: true,
      data: {
        likes: comment.likes.length,
        isLiked: likeIndex === -1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router; 