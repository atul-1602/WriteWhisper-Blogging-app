import { NextRequest, NextResponse } from 'next/server';
import BlogModel from '../../../../lib/models/Blog';
import { protect, AuthenticatedRequest } from '../../../../lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // Use the protect middleware
    const authResult = await protect(request as AuthenticatedRequest);
    if (authResult) {
      return authResult;
    }

    const user = (request as AuthenticatedRequest).user;
    
    // Check if user exists
    if (!user || !user._id) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      );
    }

    // Get user's blog statistics
    const totalBlogs = await BlogModel.countDocuments({ author: user._id, isDeleted: false });
    
    // Get total views
    const viewsResult = await BlogModel.aggregate([
      { $match: { author: user._id, isDeleted: false } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = viewsResult.length > 0 ? viewsResult[0].totalViews : 0;
    
    // Get total likes
    const likesResult = await BlogModel.aggregate([
      { $match: { author: user._id, isDeleted: false } },
      { $group: { _id: null, totalLikes: { $sum: { $size: { $ifNull: ['$likes', []] } } } } }
    ]);
    const totalLikes = likesResult.length > 0 ? likesResult[0].totalLikes : 0;
    
    // Get total comments
    const commentsResult = await BlogModel.aggregate([
      { $match: { author: user._id, isDeleted: false } },
      { $group: { _id: null, totalComments: { $sum: { $size: { $ifNull: ['$comments', []] } } } } }
    ]);
    const totalComments = commentsResult.length > 0 ? commentsResult[0].totalComments : 0;

    const stats = {
      totalBlogs,
      totalViews,
      totalLikes,
      totalComments
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error: unknown) {
    console.error('Get my stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch your statistics' },
      { status: 500 }
    );
  }
} 