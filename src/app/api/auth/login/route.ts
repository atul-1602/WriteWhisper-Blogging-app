import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import UserModel from '../../../../lib/models/User';
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Connect to database
    await dbConnect();

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );

      // Add CORS headers to error response
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      errorResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      return errorResponse;
    }

    // Check if user is active
    if (!user.isActive) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Account is deactivated' },
        { status: 401 }
      );

      // Add CORS headers to error response
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      errorResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      return errorResponse;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      const errorResponse = NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );

      // Add CORS headers to error response
      errorResponse.headers.set('Access-Control-Allow-Origin', '*');
      errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      errorResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      return errorResponse;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    const response = NextResponse.json({
      success: true,
      data: {
        user: userResponse,
        token
      },
      message: 'Login successful'
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;

  } catch (error: unknown) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    const errorResponse = NextResponse.json(
      { 
        success: false, 
        error: errorMessage
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