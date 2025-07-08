import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import UserModel from '../models/User';
import dbConnect from '../utils/db';

export interface AuthenticatedRequest extends NextRequest {
  user?: any;
}

export const protect = async (req: AuthenticatedRequest) => {
  let token;

  if (req.headers.get('authorization')?.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.get('authorization')?.split(' ')[1];

      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Not authorized, no token' },
          { status: 401 }
        );
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

      // Connect to database
      await dbConnect();

      // Get user from token
      const user = await UserModel.findById(decoded.id).select('-password');

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 401 }
        );
      }

      if (!user.isActive) {
        return NextResponse.json(
          { success: false, error: 'Account is deactivated' },
          { status: 401 }
        );
      }

      // Add user to request
      req.user = user;
      return null; // Continue to next middleware
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { success: false, error: 'Not authorized, token failed' },
        { status: 401 }
      );
    }
  }

  return NextResponse.json(
    { success: false, error: 'Not authorized, no token' },
    { status: 401 }
  );
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest) => {
    if (!req.user) {
      return NextResponse.json(
        { success: false, error: 'Not authorized' },
        { status: 401 }
      );
    }

    if (!roles.includes(req.user.role)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `User role ${req.user.role} is not authorized to access this route` 
        },
        { status: 403 }
      );
    }

    return null; // Continue to next middleware
  };
}; 