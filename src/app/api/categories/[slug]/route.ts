import { NextRequest, NextResponse } from 'next/server';
import CategoryModel from '../../../../lib/models/Category';
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
  context: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await context.params;

    // Find category by slug
    const category = await CategoryModel.findOne({ 
      slug, 
      isActive: true 
    });

    if (!category) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );

      // Add CORS headers to error response
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      errorResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      return errorResponse;
    }

    // Get blog count for this category
    const blogCount = await BlogModel.countDocuments({ 
      category: category._id, 
      isDeleted: false, 
      isPublished: true 
    });

    const categoryWithCount = {
      ...category.toObject(),
      blogCount
    };

    const response = NextResponse.json({
      success: true,
      data: categoryWithCount
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;

  } catch (error: unknown) {
    console.error('Get category error:', error);
    const errorResponse = NextResponse.json(
      { success: false, error: 'Failed to fetch category' },
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