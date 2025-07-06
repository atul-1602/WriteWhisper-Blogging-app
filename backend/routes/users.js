import express from 'express';
import UserModel from '../models/User.js';
import BlogModel from '../models/Blog.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/:username
router.get('/:username', async (req, res) => {
  try {
    const user = await UserModel.findOne({ 
      username: req.params.username,
      isActive: true 
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get user's published blogs
    const blogs = await BlogModel.find({
      author: user._id,
      isPublished: true,
      isDeleted: false
    }).select('title slug excerpt coverImage createdAt views likeCount commentCount');

    res.json({
      success: true,
      data: {
        user,
        blogs
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Follow/Unfollow user
// @route   POST /api/users/:id/follow
router.post('/:id/follow', protect, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'You cannot follow yourself'
      });
    }

    const userToFollow = await UserModel.findById(req.params.id);
    const currentUser = await UserModel.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== req.params.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      // Follow
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
      success: true,
      data: {
        isFollowing: !isFollowing,
        followerCount: userToFollow.followers.length,
        followingCount: currentUser.following.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user's bookmarks
// @route   GET /api/users/bookmarks
router.get('/bookmarks', protect, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).populate({
      path: 'bookmarks',
      match: { isDeleted: false },
      populate: {
        path: 'author',
        select: 'username firstName lastName avatar'
      }
    });

    res.json({
      success: true,
      data: user.bookmarks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

export default router; 