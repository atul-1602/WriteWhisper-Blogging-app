import express from 'express';
import { body, validationResult } from 'express-validator';
import BlogModel from '../models/Blog.js';
import UserModel from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Search blogs
router.get('/search', async (req, res) => {
  try {
    const { search, category, sort = 'newest', page = 1, limit = 10 } = req.query;
    
    // Build search query
    let query = { isPublished: true, isDeleted: false };
    
    // Search in title, content, excerpt, and tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'oldest':
        sortObj.createdAt = 1;
        break;
      case 'popular':
        // For popularity, we'll sort by views as a proxy since likes array length sorting is complex
        sortObj.views = -1;
        break;
      case 'views':
        sortObj.views = -1;
        break;
      default: // newest
        sortObj.createdAt = -1;
    }
    
    // Execute query
    const blogs = await BlogModel.find(query)
      .populate('author', 'username firstName lastName avatar')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await BlogModel.countDocuments(query);
    
    res.json({
      success: true,
      data: blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await BlogModel.find({ isPublished: true, isDeleted: false })
      .populate('author', 'username firstName lastName avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await BlogModel.findOne({
      $or: [ { _id: req.params.id }, { slug: req.params.id } ],
      isDeleted: false
    }).populate('author', 'username firstName lastName avatar');
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    blog.views += 1;
    await blog.save();
    res.json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create new blog
router.post('/', protect, [
  body('title').notEmpty(),
  body('content').notEmpty(),
  body('category').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }
    const { title, content, excerpt, category, tags, coverImage, status } = req.body;
    const blog = await BlogModel.create({
      title,
      content,
      excerpt,
      category,
      tags: tags || [],
      coverImage,
      author: req.user._id,
      status: status || 'draft',
      isPublished: status === 'published'
    });
    if (blog.isPublished) {
      blog.publishedAt = new Date();
      await blog.save();
    }
    const populatedBlog = await blog.populate('author', 'username firstName lastName avatar');
    res.status(201).json({ success: true, data: populatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update blog
router.put('/:id', protect, [
  body('title').optional().notEmpty(),
  body('content').optional().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, error: errors.array()[0].msg });
    }
    const blog = await BlogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    const { title, content, excerpt, category, tags, coverImage, status } = req.body;
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (category) blog.category = category;
    if (tags) blog.tags = tags;
    if (coverImage !== undefined) blog.coverImage = coverImage;
    if (status) {
      blog.status = status;
      blog.isPublished = status === 'published';
      if (status === 'published' && !blog.publishedAt) {
        blog.publishedAt = new Date();
      }
    }
    const updatedBlog = await blog.save();
    const populatedBlog = await updatedBlog.populate('author', 'username firstName lastName avatar');
    res.json({ success: true, data: populatedBlog });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete blog
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
    blog.isDeleted = true;
    await blog.save();
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Like/Unlike blog
router.post('/:id/like', protect, async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    const likeIndex = blog.likes.findIndex(like => like.user.toString() === req.user._id.toString());
    if (likeIndex > -1) {
      blog.likes.splice(likeIndex, 1);
    } else {
      blog.likes.push({ user: req.user._id });
    }
    await blog.save();
    res.json({ success: true, data: { likes: blog.likes.length, isLiked: likeIndex === -1 } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Bookmark/Unbookmark blog
router.post('/:id/bookmark', protect, async (req, res) => {
  try {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    const bookmarkIndex = blog.bookmarks.indexOf(req.user._id);
    if (bookmarkIndex > -1) {
      blog.bookmarks.splice(bookmarkIndex, 1);
    } else {
      blog.bookmarks.push(req.user._id);
    }
    await blog.save();
    const user = await UserModel.findById(req.user._id);
    if (bookmarkIndex > -1) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== req.params.id);
    } else {
      user.bookmarks.push(req.params.id);
    }
    await user.save();
    res.json({ success: true, data: { bookmarks: blog.bookmarks.length, isBookmarked: bookmarkIndex === -1 } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get user's blogs
router.get('/user/:userId', async (req, res) => {
  try {
    const blogs = await BlogModel.find({ author: req.params.userId, isPublished: true, isDeleted: false })
      .populate('author', 'username firstName lastName avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router; 