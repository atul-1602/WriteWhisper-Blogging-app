import { NextRequest, NextResponse } from 'next/server';
import BlogModel from '../../../lib/models/Blog';
import CategoryModel from '../../../lib/models/Category';
import dbConnect from '../../../lib/utils/db';
import { protect, AuthenticatedRequest } from '../../../lib/middleware/auth';

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

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Authenticate user
    const authResult = await protect(request as AuthenticatedRequest);
    if (authResult) {
      // Add CORS headers to auth error response
      authResult.headers.set('Access-Control-Allow-Origin', '*');
      authResult.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      authResult.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      authResult.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      return authResult;
    }

    const body = await request.json();
    const { title, excerpt, content, category, coverImage, readTime, featured } = body;

    // Validate required fields
    if (!title || !excerpt || !content || !category) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Title, excerpt, content, and category are required' },
        { status: 400 }
      );

      // Add CORS headers to error response
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      errorResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      return errorResponse;
    }

    // Get user from request
    const user = (request as AuthenticatedRequest).user;

    // Create new blog
    const blog = await BlogModel.create({
      title,
      excerpt,
      content,
      category,
      coverImage: coverImage || '',
      readTime: readTime || 5,
      featured: featured || false,
      author: user._id,
      isPublished: true,
      isDeleted: false
    });

    // Populate author and category
    await blog.populate('author', 'firstName lastName avatar');
    await blog.populate('category', 'name color');

    const response = NextResponse.json({
      success: true,
      data: blog,
      message: 'Blog created successfully'
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;

  } catch (error: unknown) {
    console.error('Create blog error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create blog';
    const errorResponse = NextResponse.json(
      { success: false, error: errorMessage },
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

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const categorySlug = searchParams.get('categorySlug');
    const search = searchParams.get('search');

    // Build query
    const query: Record<string, unknown> = { isDeleted: false, isPublished: true };

    if (featured === 'true') {
      query.featured = true;
    }

    if (category) {
      query.category = category;
    }

    if (categorySlug) {
      // Find category by slug first
      const categoryDoc = await CategoryModel.findOne({ slug: categorySlug, isActive: true });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        // Return empty results if category not found
        const response = NextResponse.json({
          success: true,
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0
          }
        });

        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

        return response;
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get blogs with pagination
    const blogs = await BlogModel.find(query)
      .populate('author', 'firstName lastName avatar')
      .populate('category', 'name color')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content');

    // Get total count
    const total = await BlogModel.countDocuments(query);

    const response = NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;

  } catch (error: unknown) {
    console.error('Get blogs error:', error);
    const errorResponse = NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
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