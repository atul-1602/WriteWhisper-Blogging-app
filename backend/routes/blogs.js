import express from 'express';
import { body, validationResult } from 'express-validator';
import BlogModel from '../models/Blog.js';
import UserModel from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;
    const featured = req.query.featured === 'true';

    let query = {
      isPublished: true,
      isDeleted: false
    };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (featured) {
      query.featured = true;
    }

    const blogs = await BlogModel.find(query)
      .populate('author', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BlogModel.countDocuments(query);

    res.json({
      success: true,
      data: blogs,
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

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await BlogModel.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ],
      isDeleted: false
    }).populate('author', 'username firstName lastName avatar bio');

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
router.post('/', protect, [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { title, content, excerpt, category, tags, coverImage, seo } = req.body;

    const blog = await BlogModel.create({
      title,
      content,
      excerpt,
      category,
      tags: tags || [],
      coverImage,
      seo,
      author: req.user._id,
      status: req.body.status || 'draft',
      isPublished: req.body.status === 'published'
    });

    if (blog.isPublished) {
      blog.publishedAt = new Date();
      await blog.save();
    }

    const populatedBlog = await blog.populate('author', 'username firstName lastName avatar');

    res.status(201).json({
      success: true,
      data: populatedBlog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
router.put('/:id', protect, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const blog = await BlogModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Check ownership or admin role
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this blog'
      });
    }

    const { title, content, excerpt, category, tags, coverImage, seo, status } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (category) blog.category = category;
    if (tags) blog.tags = tags;
    if (coverImage !== undefined) blog.coverImage = coverImage;
    if (seo) blog.seo = seo;
    if (status) {
      blog.status = status;
      blog.isPublished = status === 'published';
      if (status === 'published' && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
    }

    const updatedBlog = await blog.save();
    const populatedBlog = await updatedBlog.populate('author', 'username firstName lastName avatar');

    res.json({
      success: true,
      data: populatedBlog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Check ownership or admin role
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this blog'
      });
    }

    // Soft delete
    blog.isDeleted = true;
    await blog.save();

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Like/Unlike blog
// @route   POST /api/blogs/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    const likeIndex = blog.likes.findIndex(
      like => like.user.toString() === req.user._id.toString()
    );

    if (likeIndex > -1) {
      // Unlike
      blog.likes.splice(likeIndex, 1);
    } else {
      // Like
      blog.likes.push({ user: req.user._id });
    }

    await blog.save();

    res.json({
      success: true,
      data: {
        likes: blog.likes.length,
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

// @desc    Bookmark/Unbookmark blog
// @route   POST /api/blogs/:id/bookmark
// @access  Private
router.post('/:id/bookmark', protect, async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    const bookmarkIndex = blog.bookmarks.indexOf(req.user._id);

    if (bookmarkIndex > -1) {
      // Remove bookmark
      blog.bookmarks.splice(bookmarkIndex, 1);
    } else {
      // Add bookmark
      blog.bookmarks.push(req.user._id);
    }

    await blog.save();

    // Update user's bookmarks
    const user = await UserModel.findById(req.user._id);
    if (bookmarkIndex > -1) {
      user.bookmarks = user.bookmarks.filter(
        id => id.toString() !== req.params.id
      );
    } else {
      user.bookmarks.push(req.params.id);
    }
    await user.save();

    res.json({
      success: true,
      data: {
        bookmarks: blog.bookmarks.length,
        isBookmarked: bookmarkIndex === -1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user's blogs
// @route   GET /api/blogs/user/:userId
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await BlogModel.find({
      author: req.params.userId,
      isPublished: true,
      isDeleted: false
    })
    .populate('author', 'username firstName lastName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await BlogModel.countDocuments({
      author: req.params.userId,
      isPublished: true,
      isDeleted: false
    });

    res.json({
      success: true,
      data: blogs,
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

// @desc    Get trending blogs
// @route   GET /api/blogs/trending
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const blogs = await BlogModel.find({
      isPublished: true,
      isDeleted: false
    })
    .populate('author', 'username firstName lastName avatar')
    .sort({ views: -1, 'likes.length': -1 })
    .limit(limit);

    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router; 