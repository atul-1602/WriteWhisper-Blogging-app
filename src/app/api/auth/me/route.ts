import { NextRequest, NextResponse } from 'next/server';
import { protect, AuthenticatedRequest } from '../../../../lib/middleware/auth';

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

export async function GET(request: NextRequest) {
  try {
    // Use the protect middleware
    const authResult = await protect(request as AuthenticatedRequest);
    if (authResult) {
      // Add CORS headers to auth error response
      authResult.headers.set('Access-Control-Allow-Origin', '*');
      authResult.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      authResult.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      authResult.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      return authResult;
    }

    // User is now available in request.user
    const user = (request as AuthenticatedRequest).user;

    const response = NextResponse.json({
      success: true,
      data: user,
      message: 'User profile retrieved successfully'
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;

  } catch (error: unknown) {
    console.error('Get user profile error:', error);
    const errorResponse = NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get user profile' 
      },
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