# WriteWhisper Blog Platform

A modern, full-stack blog platform built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Node.js**. This project has been migrated from a React + Express setup to a unified Next.js application with integrated backend functionality.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Authentication**: Complete user authentication system with JWT
- **Blog Management**: Create, edit, and manage blog posts
- **Real-time Features**: Like, comment, and bookmark functionality
- **Search & Filter**: Advanced search with category filtering
- **User Profiles**: Personal profiles with avatar and bio
- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Mobile-first approach
- **TypeScript**: Full type safety throughout the application
- **SEO Optimized**: Built-in SEO features with Next.js

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing

## 📁 Project Structure

```
writewhisper-blog/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/             # Authentication pages
│   │   ├── signup/
│   │   ├── dashboard/         # User dashboard
│   │   ├── search/            # Blog search
│   │   ├── profile/           # User profiles
│   │   ├── blog/              # Blog pages
│   │   ├── category/          # Category pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── not-found.tsx      # 404 page
│   ├── components/            # Reusable components
│   │   ├── Auth/             # Authentication components
│   │   └── Layout/            # Layout components
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.tsx    # Authentication context
│   │   └── ThemeContext.tsx   # Theme context
│   └── services/              # API services
│       └── api.ts             # Axios configuration
├── backend/                   # Express.js backend
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom middleware
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   ├── utils/                 # Utility functions
│   ├── package.json           # Backend dependencies
│   └── server.js              # Express server
├── public/                    # Static assets
├── package.json               # Frontend dependencies
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd writewhisper-blog
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```
   
   Create `.env` in the `backend` directory:
   ```env
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start them separately
   npm run dev          # Frontend only (port 3000)
   npm run dev:backend  # Backend only (port 3001)
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run dev:backend` | Start Express backend server |
| `npm run dev:full` | Start both frontend and backend |
| `npm run build` | Build the Next.js application |
| `npm run start` | Start production Next.js server |
| `npm run start:backend` | Start production backend server |
| `npm run lint` | Run ESLint |
| `npm run install:backend` | Install backend dependencies |
| `npm run install:all` | Install all dependencies |

## 🔧 Configuration

### Frontend Configuration

The frontend uses Next.js 15 with the App Router. Key configurations:

- **Tailwind CSS**: Configured with custom colors and components
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Framer Motion**: For animations

### Backend Configuration

The backend is a standard Express.js application with:

- **MongoDB**: Database connection with Mongoose
- **JWT**: Authentication middleware
- **CORS**: Cross-origin requests enabled
- **File Upload**: Multer for image uploads

## 🎨 Customization

### Styling

The project uses Tailwind CSS with custom design tokens:

- **Colors**: Primary, secondary, and accent color palettes
- **Components**: Pre-built button, input, card components
- **Animations**: Custom keyframes and transitions

### Themes

The application supports light and dark themes with automatic system preference detection.

## 🔒 Authentication

The authentication system includes:

- User registration and login
- JWT token management
- Protected routes
- Password hashing with bcrypt
- Token refresh functionality

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first approach
- Breakpoint-specific layouts
- Touch-friendly interactions
- Optimized images and assets

## 🚀 Deployment

### Frontend Deployment

The Next.js application can be deployed to:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- Any Node.js hosting platform

### Backend Deployment

The Express.js backend can be deployed to:

- **Railway**
- **Heroku**
- **DigitalOcean**
- **AWS EC2**
- Any Node.js hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Migration Notes

This project was migrated from a React + Express setup to Next.js. Key changes:

- **Routing**: React Router → Next.js App Router
- **State Management**: React Context (maintained)
- **Styling**: Tailwind CSS (maintained)
- **API Calls**: Axios (maintained)
- **Authentication**: JWT (maintained)

The backend remains largely unchanged, ensuring API compatibility.

---

**Built with ❤️ by the WriteWhisper Team** 