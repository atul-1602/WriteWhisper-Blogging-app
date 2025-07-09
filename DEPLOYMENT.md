# WriteWhisper Deployment Guide

## Environment Variables Setup

### For Production Deployment

When deploying to production, you need to set the following environment variables:

#### Required Environment Variables

```bash
# Database
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/writewhisper?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Application URLs (Optional - will auto-detect if not set)
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_API_URL=https://your-domain.com/api

# Security
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
```

#### Optional Environment Variables

```bash
# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## Platform-Specific Instructions

### Vercel

1. Go to your project dashboard
2. Navigate to Settings > Environment Variables
3. Add each environment variable listed above
4. Make sure to set the environment to "Production"

### Netlify

1. Go to your site dashboard
2. Navigate to Site settings > Environment variables
3. Add each environment variable listed above

### Railway

1. Go to your project dashboard
2. Navigate to Variables tab
3. Add each environment variable listed above

### Render

1. Go to your service dashboard
2. Navigate to Environment tab
3. Add each environment variable listed above

## Important Notes

1. **API URL Auto-Detection**: The app will automatically detect the correct API URL in production using `window.location.origin`. You don't need to set `NEXT_PUBLIC_API_URL` unless you want to override this behavior.

2. **JWT Secret**: Make sure to use a strong, unique JWT secret in production. You can generate one using:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Database**: Use a production MongoDB instance (MongoDB Atlas recommended).

4. **Security**: Never commit environment variables to your repository. Use your platform's environment variable management system.

## Testing Production Deployment

After deployment, test these endpoints:

- `https://your-domain.com/api/health` - Should return health status
- `https://your-domain.com/api/auth/register` - Should accept POST requests
- `https://your-domain.com/api/auth/login` - Should accept POST requests

## Troubleshooting

### API Calls Still Going to Localhost

If your app is still making API calls to localhost after deployment:

1. Clear your browser cache
2. Check that environment variables are set correctly in your deployment platform
3. Verify that the deployment is using the latest code

### CORS Issues

The app is configured to handle CORS automatically. If you're still having CORS issues:

1. Check that your domain is correctly set in environment variables
2. Verify that the API routes are working correctly

### Database Connection Issues

If you're having database connection issues:

1. Verify your MongoDB URI is correct
2. Check that your MongoDB instance allows connections from your deployment platform
3. Ensure your database user has the correct permissions 