import mongoose from 'mongoose';
import BlogModel from './models/Blog.js';
import UserModel from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleBlogs = [
  {
    title: 'Getting Started with React: A Complete Guide for Beginners',
    content: `React is a powerful JavaScript library for building user interfaces. In this comprehensive guide, we'll explore the fundamentals of React, including components, state management, and hooks.

React was developed by Facebook and has become one of the most popular frontend libraries in the world. It's known for its component-based architecture, virtual DOM, and declarative programming style.

In this tutorial, we'll cover:
- Setting up a React development environment
- Understanding JSX syntax
- Working with components and props
- Managing state with useState and useEffect
- Building interactive user interfaces
- Best practices for React development

Whether you're a complete beginner or looking to refresh your React knowledge, this guide will help you get started with building modern web applications.`,
    excerpt: 'Learn the fundamentals of React development with this comprehensive beginner-friendly guide covering components, hooks, and best practices.',
    category: 'Programming',
    tags: ['react', 'javascript', 'frontend', 'web-development'],
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    status: 'published',
    isPublished: true,
    views: 1250,
    likes: []
  },
  {
    title: 'The Future of Artificial Intelligence in 2024',
    content: `Artificial Intelligence continues to evolve at an unprecedented pace, transforming industries and reshaping how we live and work. In 2024, we're witnessing breakthroughs in machine learning, natural language processing, and computer vision.

Key trends in AI for 2024 include:
- Large Language Models and their applications
- AI-powered automation in various industries
- Ethical considerations in AI development
- The rise of edge AI and IoT integration
- AI in healthcare and medical diagnosis

This article explores these trends and their implications for businesses and society. We'll also discuss the challenges and opportunities that lie ahead in the AI landscape.`,
    excerpt: 'Explore the latest trends and developments in artificial intelligence, from large language models to ethical considerations shaping the future of AI.',
    category: 'Technology',
    tags: ['ai', 'machine-learning', 'technology', 'future'],
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    status: 'published',
    isPublished: true,
    views: 2100,
    likes: []
  },
  {
    title: 'Design Principles for Modern Web Applications',
    content: `Good design is crucial for creating successful web applications. In today's competitive digital landscape, users expect intuitive, beautiful, and functional interfaces that provide excellent user experiences.

This article covers essential design principles including:
- User-centered design methodology
- Visual hierarchy and typography
- Color theory and accessibility
- Responsive design patterns
- Micro-interactions and animations
- Performance and usability considerations

We'll explore real-world examples and case studies to demonstrate how these principles can be applied to create compelling web applications that users love to use.`,
    excerpt: 'Master the essential design principles for creating modern, user-friendly web applications that deliver exceptional user experiences.',
    category: 'Design',
    tags: ['design', 'ui-ux', 'web-design', 'user-experience'],
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
    status: 'published',
    isPublished: true,
    views: 890,
    likes: []
  },
  {
    title: 'Building a Successful Startup: Lessons from Silicon Valley',
    content: `Starting a business is one of the most challenging yet rewarding endeavors you can undertake. Drawing from the experiences of successful Silicon Valley entrepreneurs, this article provides insights into building a startup from the ground up.

Key topics covered:
- Validating your business idea
- Building the right team
- Securing funding and investment
- Product development and market fit
- Scaling and growth strategies
- Common pitfalls to avoid

Whether you're just starting out or looking to scale your existing business, these lessons from successful entrepreneurs will help guide your journey.`,
    excerpt: 'Learn valuable lessons from Silicon Valley entrepreneurs on building and scaling successful startups, from idea validation to growth strategies.',
    category: 'Business',
    tags: ['startup', 'entrepreneurship', 'business', 'silicon-valley'],
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    status: 'published',
    isPublished: true,
    views: 1560,
    likes: []
  },
  {
    title: 'Healthy Living: A Complete Guide to Wellness in 2024',
    content: `In today's fast-paced world, maintaining good health and wellness has become more important than ever. This comprehensive guide covers all aspects of healthy living, from nutrition and exercise to mental health and stress management.

Topics include:
- Balanced nutrition and meal planning
- Effective exercise routines for different fitness levels
- Mental health and mindfulness practices
- Sleep optimization and recovery
- Stress management techniques
- Building sustainable healthy habits

Discover practical strategies for improving your overall well-being and creating a healthier, more balanced lifestyle.`,
    excerpt: 'Discover comprehensive strategies for maintaining health and wellness in 2024, covering nutrition, exercise, mental health, and sustainable lifestyle habits.',
    category: 'Health',
    tags: ['health', 'wellness', 'nutrition', 'fitness', 'lifestyle'],
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    status: 'published',
    isPublished: true,
    views: 980,
    likes: []
  },
  {
    title: 'Travel Photography: Capturing Memories Around the World',
    content: `Travel photography is more than just taking pictures – it's about telling stories and preserving memories of your adventures. This guide will help you improve your travel photography skills and capture stunning images wherever you go.

Learn about:
- Essential photography equipment for travel
- Composition techniques for different landscapes
- Lighting and timing for optimal shots
- Post-processing and editing tips
- Storytelling through photography
- Respectful photography practices

From urban landscapes to natural wonders, discover how to capture the essence of your travels and create lasting memories through photography.`,
    excerpt: 'Master the art of travel photography with tips on equipment, composition, lighting, and storytelling to capture stunning memories from your adventures.',
    category: 'Travel',
    tags: ['photography', 'travel', 'art', 'adventure'],
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    status: 'published',
    isPublished: true,
    views: 720,
    likes: []
  }
];

const seedBlogs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get a user to use as author (create one if none exists)
    let user = await UserModel.findOne();
    if (!user) {
      user = await UserModel.create({
        username: 'demo_user',
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        password: 'password123',
        avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=3b82f6&color=fff'
      });
      console.log('Created demo user');
    }

    // Clear existing blogs
    await BlogModel.deleteMany({});
    console.log('Cleared existing blogs');

    // Create sample blogs one by one to ensure proper slug generation
    for (const blogData of sampleBlogs) {
      const blog = new BlogModel({
        ...blogData,
        author: user._id
      });
      await blog.save();
      console.log(`Created blog: ${blog.title}`);
    }

    console.log('Sample blogs seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding blogs:', error);
    process.exit(1);
  }
};

seedBlogs(); 