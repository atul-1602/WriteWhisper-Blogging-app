# Deployment Guide for WriteWhisper

## Deploying on Render

### Option 1: Deploy Backend Only (Recommended for API-only deployment)

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Set the following configuration:
     - **Root Directory**: `backend`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Environment**: `Node`

2. **Environment Variables**
   Set these environment variables in your Render service:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=https://your-frontend-url.com
   ```

3. **Deploy**
   - Render will automatically build and deploy your backend
   - The API will be available at `https://your-service-name.onrender.com/api`

### Option 2: Deploy Full Stack (Frontend + Backend)

1. **Build Frontend Locally**
   ```bash
   cd frontened
   npm install
   npm run build
   ```

2. **Copy Frontend Build to Backend**
   ```bash
   mkdir -p backend/public
   cp -r frontened/dist/* backend/public/
   ```

3. **Deploy Backend**
   - Follow the same steps as Option 1
   - The backend will serve both the API and the frontend

### Current Issue Resolution

The error you're seeing:
```
[Error: ENOENT: no such file or directory, stat '/opt/render/project/src/frontened/dist/index.html']
```

This happens because the backend is trying to serve frontend files that don't exist on Render. The updated code now:

1. **Checks if frontend build exists** before trying to serve it
2. **Falls back to API-only mode** if frontend build is not found
3. **Provides a build script** to automatically build frontend during deployment

### Build Process

The `build` script in `backend/package.json` will:
1. Navigate to the frontend directory
2. Install frontend dependencies
3. Build the frontend
4. Copy the build files to `backend/public/`

### Troubleshooting

1. **If you see "Frontend build not found"**: This is normal if you're deploying backend-only
2. **If you want to serve the frontend**: Make sure to run the build script or manually copy the frontend build files
3. **API endpoints**: All API endpoints will work regardless of frontend build status

### API Endpoints

Your API will be available at:
- Health check: `GET /api/health`
- Authentication: `POST /api/auth/*`
- Blogs: `GET/POST/PUT/DELETE /api/blogs/*`
- Categories: `GET/POST/PUT/DELETE /api/categories/*`
- Comments: `GET/POST/PUT/DELETE /api/comments/*` 