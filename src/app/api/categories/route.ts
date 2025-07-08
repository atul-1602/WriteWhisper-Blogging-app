import { NextResponse } from 'next/server';
import CategoryModel from '../../../lib/models/Category';
import BlogModel from '../../../lib/models/Blog';
import dbConnect from '../../../lib/utils/db';

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

export async function GET() {
  try {
    await dbConnect();

    const categories = await CategoryModel.find({ isActive: true })
      .sort({ name: 1 });

    // Get blog count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const blogCount = await BlogModel.countDocuments({
          category: category._id,
          isDeleted: false,
          isPublished: true
        });

        return {
          ...category.toJSON(),
          blogCount
        };
      })
    );

    const response = NextResponse.json({
      success: true,
      data: categoriesWithCount
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;

  } catch (error: unknown) {
    console.error('Get categories error:', error);
    const errorResponse = NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
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