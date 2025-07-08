require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string from .env
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI not set in .env file');
}

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schemas that match the TypeScript models
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ""
  },
  avatar: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
}, {
  timestamps: true
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: 200,
    default: ""
  },
  color: {
    type: String,
    default: "#3B82F6"
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 300,
    default: ""
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverImage: {
    type: String,
    default: ""
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    default: []
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate slug for category
categorySchema.pre('save', async function(next) {
  if (!this.isModified('name')) return next();
  try {
    let slug = this.name.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-');
    if (!slug) {
      slug = 'category-' + Date.now();
    }
    const existingCategory = await this.constructor.findOne({ slug, _id: { $ne: this._id } });
    if (existingCategory) {
      slug = slug + '-' + Date.now();
    }
    this.slug = slug;
    next();
  } catch (error) {
    next(error);
  }
});

// Generate slug for blog
blogSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  this.slug = this.title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-');
  next();
});

// Hash password for user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);
const Category = mongoose.model('Category', categorySchema);
const Blog = mongoose.model('Blog', blogSchema);

// Demo data
const demoCategories = [
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Latest tech trends, programming, and digital innovations',
    color: '#3B82F6',
    isActive: true
  },
  {
    name: 'Travel',
    slug: 'travel',
    description: 'Adventure stories, travel tips, and destination guides',
    color: '#10B981',
    isActive: true
  },
  {
    name: 'Food & Cooking',
    slug: 'food-cooking',
    description: 'Recipes, cooking tips, and culinary adventures',
    color: '#F59E0B',
    isActive: true
  },
  {
    name: 'Health & Wellness',
    slug: 'health-wellness',
    description: 'Fitness, nutrition, and mental health tips',
    color: '#EF4444',
    isActive: true
  },
  {
    name: 'Business',
    slug: 'business',
    description: 'Entrepreneurship, marketing, and business insights',
    color: '#8B5CF6',
    isActive: true
  }
];

const demoBlogs = [
  {
    title: 'The Future of Artificial Intelligence in 2024',
    excerpt: 'Explore the latest developments in AI technology and how they\'re shaping our future.',
    content: `<h2>The Rise of AI in Everyday Life</h2><p>Artificial Intelligence has become an integral part of our daily lives, from the smartphones we use to the cars we drive. In 2024, we're seeing unprecedented advancements in AI technology that are transforming industries and reshaping how we work and live.</p><p>The integration of AI in various sectors has led to remarkable improvements in efficiency, accuracy, and user experience. From healthcare to finance, education to entertainment, AI is revolutionizing the way we approach complex problems and create innovative solutions.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    readTime: 8,
    featured: true,
    tags: ['AI', 'Technology', 'Future', 'Innovation'],
    category: 'Technology'
  },
  {
    title: '10 Essential Cooking Techniques Every Home Chef Should Master',
    excerpt: 'Master these fundamental cooking techniques to elevate your culinary skills and create restaurant-quality dishes at home.',
    content: `<h2>Building a Strong Culinary Foundation</h2><p>Great cooking starts with mastering the basics. These ten essential techniques form the foundation of professional cooking and will help you create delicious, well-executed dishes in your own kitchen.</p><p>From proper knife skills to understanding heat control, these fundamental techniques will transform your cooking experience and help you develop confidence in the kitchen.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop',
    readTime: 12,
    featured: true,
    tags: ['Cooking', 'Techniques', 'Home Chef', 'Culinary'],
    category: 'Food & Cooking'
  },
  {
    title: 'Hidden Gems: Exploring the Lesser-Known Islands of Greece',
    excerpt: 'Discover the authentic beauty of Greece beyond the tourist hotspots with these stunning hidden island destinations.',
    content: `<h2>Beyond Santorini and Mykonos</h2><p>While Santorini and Mykonos are undoubtedly beautiful, Greece has so much more to offer. These lesser-known islands provide an authentic Greek experience without the crowds and tourist traps.</p><p>From the pristine beaches of Milos to the traditional villages of Naxos, these hidden gems offer a glimpse into the real Greece that many tourists never get to experience.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=400&fit=crop',
    readTime: 10,
    featured: false,
    tags: ['Greece', 'Travel', 'Islands', 'Hidden Gems'],
    category: 'Travel'
  },
  {
    title: 'Building a Sustainable Fitness Routine That Actually Works',
    excerpt: 'Learn how to create a fitness routine that fits your lifestyle and helps you achieve lasting results.',
    content: `<h2>The Foundation of Lasting Fitness</h2><p>Creating a sustainable fitness routine isn't about following the latest fad or pushing yourself to extremes. It's about building habits that fit your lifestyle and help you achieve your long-term health goals.</p><p>By focusing on consistency, gradual progression, and enjoyment, you can create a fitness routine that becomes a natural part of your daily life rather than a temporary challenge.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    readTime: 7,
    featured: false,
    tags: ['Fitness', 'Health', 'Wellness', 'Routine'],
    category: 'Health & Wellness'
  },
  {
    title: 'The Psychology of Successful Entrepreneurship',
    excerpt: 'Discover the mental frameworks and psychological traits that separate successful entrepreneurs from the rest.',
    content: `<h2>The Mindset of Success</h2><p>Entrepreneurship is as much about psychology as it is about business strategy. Understanding the mental frameworks that drive successful entrepreneurs can help you develop the mindset needed for your own business journey.</p><p>From resilience in the face of failure to the ability to spot opportunities where others see obstacles, the psychological aspects of entrepreneurship are often the key differentiators between success and failure.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    readTime: 9,
    featured: true,
    tags: ['Entrepreneurship', 'Psychology', 'Success', 'Business'],
    category: 'Business'
  }
];

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Blog.deleteMany({});

    // Create a demo user
    console.log('👤 Creating demo user...');
    const demoUser = new User({
      username: 'demouser',
      email: 'demo@example.com',
      password: 'password123',
      firstName: 'Demo',
      lastName: 'User',
      bio: 'Demo user for testing purposes',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: 'user',
      isActive: true
    });
    const savedUser = await demoUser.save();
    console.log(`✅ Created user: ${savedUser.firstName} ${savedUser.lastName}`);

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
    for (const blogData of demoBlogs) {
      const category = createdCategories.find(cat => cat.name === blogData.category);
      
      if (!category) {
        console.log(`⚠️ Category not found for blog: ${blogData.title}`);
        continue;
      }

      const blog = new Blog({
        ...blogData,
        author: savedUser._id,
        category: category._id, // Use ObjectId reference
        slug: blogData.title.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-'),
        status: 'published',
        isPublished: true,
        publishedAt: new Date(),
        views: Math.floor(Math.random() * 1000) + 50,
        likes: [],
        bookmarks: [],
        isDeleted: false
      });

      const savedBlog = await blog.save();
      console.log(`✅ Created blog: ${savedBlog.title}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📈 Created 1 user, ${createdCategories.length} categories, and ${demoBlogs.length} blogs`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seeding
seedDatabase(); 