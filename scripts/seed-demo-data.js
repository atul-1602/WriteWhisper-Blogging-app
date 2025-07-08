const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string - replace with your actual connection string
const MONGODB_URI = 'mongodb+srv://atul:atul123@cluster0.mongodb.net/writewhisper?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const UserModel = require('../src/lib/models/User.ts');
const CategoryModel = require('../src/lib/models/Category.ts');
const BlogModel = require('../src/lib/models/Blog.ts');

const User = UserModel.default;
const Category = CategoryModel.default;
const Blog = BlogModel.default;

// Demo data
const demoUsers = [
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    username: 'sarahwriter',
    email: 'sarah@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Passionate writer and tech enthusiast. I love sharing insights about the latest trends in technology and digital transformation.'
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    username: 'mikechen',
    email: 'michael@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Food blogger and culinary expert. Exploring the world through flavors and sharing delicious recipes with food lovers everywhere.'
  },
  {
    firstName: 'Emma',
    lastName: 'Davis',
    username: 'emmatravels',
    email: 'emma@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Travel writer and adventure seeker. Documenting my journeys around the world and sharing travel tips with fellow explorers.'
  },
  {
    firstName: 'David',
    lastName: 'Wilson',
    username: 'davidtech',
    email: 'david@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Tech enthusiast and software developer. Writing about the latest in AI, machine learning, and software development.'
  },
  {
    firstName: 'Lisa',
    lastName: 'Brown',
    username: 'lisafitness',
    email: 'lisa@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    bio: 'Fitness coach and wellness advocate. Helping people achieve their health goals through sustainable lifestyle changes.'
  },
  {
    firstName: 'Alex',
    lastName: 'Martinez',
    username: 'alexmartinez',
    email: 'alex@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=150&h=150&fit=crop&crop=face',
    bio: 'Lifestyle blogger and productivity geek. Sharing tips for a balanced and fulfilling life.'
  }
];

const demoCategories = [
  {
    name: 'Technology',
    slug: 'technology',
    color: '#3B82F6',
    description: 'Latest trends in technology, software development, and digital innovation.',
    isActive: true
  },
  {
    name: 'Food & Cooking',
    slug: 'food-cooking',
    color: '#EF4444',
    description: 'Delicious recipes, cooking tips, and culinary adventures from around the world.',
    isActive: true
  },
  {
    name: 'Travel',
    slug: 'travel',
    color: '#10B981',
    description: 'Travel guides, destination reviews, and adventure stories from globetrotters.',
    isActive: true
  },
  {
    name: 'Health & Wellness',
    slug: 'health-wellness',
    color: '#8B5CF6',
    description: 'Tips for maintaining a healthy lifestyle, fitness advice, and wellness practices.',
    isActive: true
  },
  {
    name: 'Business',
    slug: 'business',
    color: '#F59E0B',
    description: 'Business insights, entrepreneurship tips, and professional development advice.',
    isActive: true
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    color: '#EC4899',
    description: 'Personal development, lifestyle tips, and inspiration for daily living.',
    isActive: true
  }
];

const demoBlogs = [
  {
    title: 'The Future of Artificial Intelligence in 2024',
    excerpt: 'Explore the latest developments in AI technology and how they\'re shaping our future.',
    content: `<h2>The Rise of AI in Everyday Life</h2><p>Artificial Intelligence has become an integral part of our daily lives, from the smartphones we use to the cars we drive. In 2024, we\'re seeing unprecedented advancements in AI technology that are transforming industries and reshaping how we work and live.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    readTime: 8,
    featured: true,
    tags: ['AI', 'Technology', 'Future', 'Innovation'],
    category: 'Technology'
  },
  {
    title: '10 Essential Cooking Techniques Every Home Chef Should Master',
    excerpt: 'Master these fundamental cooking techniques to elevate your culinary skills and create restaurant-quality dishes at home.',
    content: `<h2>Building a Strong Culinary Foundation</h2><p>Great cooking starts with mastering the basics. These ten essential techniques form the foundation of professional cooking and will help you create delicious, well-executed dishes in your own kitchen.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
    readTime: 12,
    featured: true,
    tags: ['Cooking', 'Techniques', 'Home Chef', 'Culinary'],
    category: 'Food & Cooking'
  },
  {
    title: 'Hidden Gems: Exploring the Lesser-Known Islands of Greece',
    excerpt: 'Discover the authentic beauty of Greece beyond the tourist hotspots with these stunning hidden island destinations.',
    content: `<h2>Beyond Santorini and Mykonos</h2><p>While Santorini and Mykonos are undoubtedly beautiful, Greece has so much more to offer. These lesser-known islands provide an authentic Greek experience without the crowds and tourist traps.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=400&fit=crop',
    readTime: 10,
    featured: false,
    tags: ['Greece', 'Travel', 'Islands', 'Hidden Gems'],
    category: 'Travel'
  },
  {
    title: 'Building a Sustainable Fitness Routine That Actually Works',
    excerpt: 'Learn how to create a fitness routine that fits your lifestyle and helps you achieve lasting results.',
    content: `<h2>The Foundation of Lasting Fitness</h2><p>Creating a sustainable fitness routine isn\'t about following the latest fad or pushing yourself to extremes. It\'s about building habits that fit your lifestyle and help you achieve your long-term health goals.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    readTime: 7,
    featured: false,
    tags: ['Fitness', 'Health', 'Wellness', 'Routine'],
    category: 'Health & Wellness'
  },
  {
    title: 'The Psychology of Successful Entrepreneurship',
    excerpt: 'Discover the mental frameworks and psychological traits that separate successful entrepreneurs from the rest.',
    content: `<h2>The Mindset of Success</h2><p>Entrepreneurship is as much about psychology as it is about business strategy. Understanding the mental frameworks that drive successful entrepreneurs can help you develop the mindset needed for your own business journey.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    readTime: 9,
    featured: true,
    tags: ['Entrepreneurship', 'Psychology', 'Success', 'Business'],
    category: 'Business'
  },
  {
    title: 'Digital Minimalism: Finding Balance in a Connected World',
    excerpt: 'Learn how to use technology intentionally and create a healthier relationship with your digital devices.',
    content: `<h2>The Challenge of Digital Overload</h2><p>In our hyperconnected world, it\'s easy to feel overwhelmed by the constant stream of notifications, emails, and social media updates. Digital minimalism offers a way to use technology intentionally rather than letting it control us.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    readTime: 6,
    featured: false,
    tags: ['Digital Minimalism', 'Technology', 'Lifestyle', 'Wellness'],
    category: 'Lifestyle'
  }
];

// Function to hash passwords
async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

// Function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Blog.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of demoUsers) {
      const hashedPassword = await hashPassword(userData.password);
      const user = new User({
        ...userData,
        password: hashedPassword,
        isActive: true
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`✅ Created user: ${savedUser.firstName} ${savedUser.lastName}`);
    }

    // Create categories
    console.log('📂 Creating categories...');
    const createdCategories = [];
    for (const categoryData of demoCategories) {
      const category = new Category(categoryData);
      const savedCategory = await category.save();
      createdCategories.push(savedCategory);
      console.log(`✅ Created category: ${savedCategory.name}`);
    }

    // Create blogs
    console.log('📝 Creating blogs...');
    for (let i = 0; i < demoBlogs.length; i++) {
      const blogData = demoBlogs[i];
      const author = createdUsers[i % createdUsers.length];
      const category = createdCategories.find(cat => cat.name === blogData.category);
      
      if (!category) {
        console.log(`⚠️ Category not found for blog: ${blogData.title}`);
        continue;
      }

      const blog = new Blog({
        ...blogData,
        author: author._id,
        category: category._id,
        slug: generateSlug(blogData.title),
        isPublished: true,
        isDeleted: false,
        views: Math.floor(Math.random() * 1000) + 50,
        likeCount: Math.floor(Math.random() * 100) + 5,
        commentCount: Math.floor(Math.random() * 20) + 1,
        likes: [],
        bookmarks: []
      });

      const savedBlog = await blog.save();
      console.log(`✅ Created blog: ${savedBlog.title}`);
    }

    // Update category blog counts
    console.log('📊 Updating category blog counts...');
    for (const category of createdCategories) {
      const blogCount = await Blog.countDocuments({ category: category._id, isDeleted: false });
      await Category.findByIdAndUpdate(category._id, { blogCount });
      console.log(`✅ Updated ${category.name}: ${blogCount} blogs`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📈 Created ${createdUsers.length} users, ${createdCategories.length} categories, and ${demoBlogs.length} blogs`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding
seedDatabase(); 