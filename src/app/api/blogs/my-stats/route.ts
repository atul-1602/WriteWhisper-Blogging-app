import { NextRequest, NextResponse } from 'next/server';
import BlogModel from '../../../../lib/models/Blog';
import { protect } from '../../../../lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // Use the protect middleware
    const authResult = await protect(request as any);
    if (authResult) {
      return authResult;
    }

    const user = (request as any).user;

    // Get user's blog statistics
    const [totalBlogs, totalViews, totalLikes, totalComments] = await Promise.all([
      BlogModel.countDocuments({ author: user._id, isDeleted: false }),
      BlogModel.aggregate([
        { $match: { author: user._id, isDeleted: false } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]),
      BlogModel.aggregate([
        { $match: { author: user._id, isDeleted: false } },
        { $group: { _id: null, totalLikes: { $sum: { $size: '$likes' } } } }
      ]),
      BlogModel.aggregate([
        { $match: { author: user._id, isDeleted: false } },
        { $group: { _id: null, totalComments: { $sum: { $size: '$comments' } } } }
      ])
    ]);

    const stats = {
      totalBlogs,
      totalViews: totalViews[0]?.totalViews || 0,
      totalLikes: totalLikes[0]?.totalLikes || 0,
      totalComments: totalComments[0]?.totalComments || 0
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