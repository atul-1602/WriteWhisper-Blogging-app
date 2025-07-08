import { NextRequest, NextResponse } from 'next/server';
import BlogModel from '../../../../lib/models/Blog';
import dbConnect from '../../../../lib/utils/db';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();

    const { slug } = params;

    // Find blog by slug
    const blog = await BlogModel.findOne({ 
      slug, 
      isDeleted: false, 
      isPublished: true 
    })
    .populate('author', 'firstName lastName avatar bio')
    .populate('category', 'name color');

    if (!blog) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );

      // Add CORS headers to error response
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      errorResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      return errorResponse;
    }

    // Increment view count
    await BlogModel.findByIdAndUpdate(blog._id, {
      $inc: { views: 1 }
    });

    const response = NextResponse.json({
      success: true,
      data: blog
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;

  } catch (error: unknown) {
    console.error('Get blog error:', error);
    const errorResponse = NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    );

    // Add CORS headers to error response
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    errorResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return errorResponse;
  }
} 