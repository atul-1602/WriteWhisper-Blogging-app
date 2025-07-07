#!/bin/bash

# WriteWhisper Favicon Update Script
# This script updates the favicon across the project

echo "🔄 Updating WriteWhisper favicon..."

# Build frontend
echo "📦 Building frontend..."
cd frontened
npm run build

# Copy to backend public directory
echo "📋 Copying favicon to backend..."
cd ../backend
mkdir -p public
cp -r ../frontened/dist/* public/

echo "✅ Favicon updated successfully!"
echo "🎨 Your new favicon is now ready for deployment"
echo "📁 Files updated:"
echo "   - frontened/public/favicon.svg"
echo "   - frontened/dist/favicon.svg"
echo "   - backend/public/favicon.svg" 