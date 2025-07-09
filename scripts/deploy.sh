#!/bin/bash

# WriteWhisper Blog Platform - Production Deployment Script
# This script builds and prepares the application for production deployment

set -e

echo "🚀 Starting production deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
npm run clean

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Type checking
echo "🔍 Running type checks..."
npm run type-check

# Linting
echo "🔍 Running linting..."
npm run lint

# Build the application
echo "🏗️ Building application..."
npm run build

# Analyze bundle (optional)
if [ "$ANALYZE" = "true" ]; then
    echo "📊 Analyzing bundle..."
    npm run analyze
fi

echo "✅ Production build completed successfully!"
echo "📁 Build files are in the .next directory"
echo "🚀 Run 'npm start' to start the production server" 