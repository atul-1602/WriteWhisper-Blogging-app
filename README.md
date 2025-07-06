# WriteWhisper - Modern Blog Platform

A beautiful, modern blog platform built with React, Node.js, and MongoDB. Share your thoughts, stories, and knowledge with the world through an intuitive and engaging user experience.

## ✨ Features

### 🎨 Modern UI/UX
- **Responsive Design**: Beautiful interface that works on all devices
- **Dark/Light Mode**: Toggle between themes for comfortable reading
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Modern Typography**: Clean, readable fonts with proper hierarchy
- **Interactive Elements**: Hover effects, loading states, and micro-interactions

### 📝 Blog Management
- **Rich Text Editor**: Create beautiful blog posts with markdown support
- **Image Upload**: Drag & drop image uploads with Cloudinary integration
- **Categories & Tags**: Organize content with categories and tags
- **Draft System**: Save drafts and publish when ready
- **SEO Optimization**: Meta tags, descriptions, and URL slugs

### 👥 User Features
- **User Authentication**: Secure login/register with JWT
- **User Profiles**: Customizable profiles with avatars and bios
- **Follow System**: Follow other writers and get updates
- **Bookmarks**: Save your favorite articles for later
- **Like/Dislike**: Engage with content through reactions

### 💬 Social Features
- **Comments System**: Nested comments with replies
- **Real-time Updates**: Live notifications and updates
- **Search & Filter**: Advanced search with filters
- **Trending Content**: Discover popular and trending posts

### 🔧 Technical Features
- **RESTful API**: Clean, well-documented API endpoints
- **Database Optimization**: Indexed queries and efficient data models
- **Security**: Rate limiting, input validation, and XSS protection
- **Performance**: Optimized loading and caching strategies

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **Rate Limiting** - API rate limiting

## 📁 Project Structure

```
WriteWhisper/
├── frontened/                 # React frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Auth/         # Authentication components
│   │   │   ├── Layout/       # Layout components
│   │   │   └── UI/           # UI components
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── styles/           # Global styles
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   └── package.json
├── backend/                   # Node.js backend
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middleware/           # Express middleware
│   ├── controllers/          # Route controllers
│   ├── services/             # Business logic
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=mongodb://127.0.0.1:27017/writewhisper
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontened
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Blog Endpoints
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `POST /api/blogs/:id/like` - Like/unlike blog
- `POST /api/blogs/:id/bookmark` - Bookmark blog

### User Endpoints
- `GET /api/users/:username` - Get user profile
- `POST /api/users/:id/follow` - Follow/unfollow user
- `GET /api/users/bookmarks` - Get user bookmarks

### Category Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category with blogs

### Comment Endpoints
- `GET /api/comments/blog/:blogId` - Get blog comments
- `POST /api/comments` - Add comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like comment

## 🎯 Key Features Explained

### Database Schema
The platform uses comprehensive MongoDB schemas:

- **User Model**: Username, email, password, profile info, social links, followers
- **Blog Model**: Title, content, author, categories, tags, likes, comments, views
- **Comment Model**: Content, user, blog, replies, likes
- **Category Model**: Name, description, color, blog count

### Authentication System
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Role-based access control (user, admin, moderator)
- Account verification and activation

### Content Management
- Rich text editor with markdown support
- Image upload with Cloudinary integration
- Draft and publish workflow
- SEO optimization with meta tags

### Social Features
- Follow/unfollow system
- Like and dislike functionality
- Bookmark system
- Nested comments with replies
- Real-time notifications

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Main brand color
- **Secondary**: Gray (#64748B) - Text and UI elements
- **Accent**: Purple (#D946EF) - Highlights and CTAs
- **Success**: Green (#10B981) - Success states
- **Error**: Red (#EF4444) - Error states

### Typography
- **Inter** - Primary font for UI elements
- **Merriweather** - Serif font for blog content
- **JetBrains Mono** - Monospace font for code

### Components
- **Buttons**: Primary, secondary, outline, ghost variants
- **Cards**: Hover effects and shadows
- **Forms**: Validation and error states
- **Navigation**: Responsive with mobile menu

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or AWS

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI components inspired by modern design systems
- Animation library by [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@writewhisper.com
- Documentation: [docs.writewhisper.com](https://docs.writewhisper.com)

---

**WriteWhisper** - Share your thoughts with the world ✨ 