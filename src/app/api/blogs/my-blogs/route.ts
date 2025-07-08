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

    // Get user's blogs
    const blogs = await BlogModel.find({ 
      author: user._id,
      isDeleted: false 
    })
    .populate('category', 'name color')
    .sort({ createdAt: -1 })
    .select('-content');

    return NextResponse.json({
      success: true,
      data: blogs
    });

  } catch (error: unknown) {
    console.error('Get my blogs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch your blogs' },
      { status: 500 }
    );
  }
} 