# WriteWhisper Blog Platform

A modern, full-stack blog platform built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Node.js**. Writers can create, share, and discover amazing stories in a beautiful, responsive environment.

<img width="1512" alt="Screenshot 2025-07-09 at 10 03 44 PM" src="https://github.com/user-attachments/assets/503b078f-35f2-4a9c-ac2a-920327823129" />


<img width="1512" alt="Screenshot 2025-07-09 at 10 15 54 PM" src="https://github.com/user-attachments/assets/6cf20823-8689-45fb-b7e6-c85dc44ef78b" />


<img width="1512" alt="Screenshot 2025-07-09 at 10 16 24 PM" src="https://github.com/user-attachments/assets/4ff87305-833c-46a7-92ee-c584a652d68b" />


## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Authentication**: Complete user authentication system with JWT
- **Blog Management**: Create, edit, and manage blog posts
- **Real-time Features**: Like, comment, and bookmark functionality
- **Search & Filter**: Advanced search with category filtering
- **User Profiles**: Personal profiles with avatar and bio
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
├── public/                    # Static assets
├── package.json               # Dependencies
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

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Application: http://localhost:3000

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build the Next.js application |
| `npm run start` | Start production Next.js server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm run clean` | Clean build files |
| `npm run analyze` | Analyze bundle size |

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | API base URL | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT secret key | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm run start
   ```

### Deployment Platforms

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Static site hosting
- **Railway**: Full-stack deployment
- **DigitalOcean**: VPS deployment

## 🎨 Customization

### Styling

The project uses Tailwind CSS with custom design tokens:

- **Colors**: Primary, secondary, and accent color palettes
- **Components**: Pre-built button, input, card components
- **Animations**: Custom keyframes and transitions

### Themes

The application supports light and dark themes with automatic system preference detection.

## 🔒 Security

- JWT token management
- Password hashing with bcrypt
- CORS protection
- Security headers
- Input validation and sanitization

## 📱 Performance

- Image optimization
- Code splitting
- Bundle analysis
- Caching strategies
- SEO optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@writewhisper.com or create an issue in the repository. 
