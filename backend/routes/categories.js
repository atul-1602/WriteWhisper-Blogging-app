import express from 'express';
import CategoryModel from '../models/Category.js';
import BlogModel from '../models/Blog.js';

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await CategoryModel.find({ isActive: true });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get category with blogs
// @route   GET /api/categories/:slug
router.get('/:slug', async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ 
      slug: req.params.slug,
      isActive: true 
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await BlogModel.find({
      category: category.name,
      isPublished: true,
      isDeleted: false
    })
    .populate('author', 'username firstName lastName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await BlogModel.countDocuments({
      category: category.name,
      isPublished: true,
      isDeleted: false
    });

    res.json({
      success: true,
      data: {
        category,
        blogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
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