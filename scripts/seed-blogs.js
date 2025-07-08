import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  bio: String,
  avatar: String,
  role: String,
  isActive: Boolean,
  followers: [mongoose.Schema.Types.ObjectId],
  following: [mongoose.Schema.Types.ObjectId],
  bookmarks: [mongoose.Schema.Types.ObjectId],
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  color: String,
  isActive: Boolean
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coverImage: String,
  tags: [String],
  category: String,
  status: String,
  isPublished: Boolean,
  publishedAt: Date,
  views: Number,
  featured: Boolean,
  likes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: Date
    }
  ],
  bookmarks: [mongoose.Schema.Types.ObjectId],
  isDeleted: Boolean
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Category = mongoose.model('Category', categorySchema);
const Blog = mongoose.model('Blog', blogSchema);

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function seedBlogs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    const categories = await Category.find({});
    if (!users.length || !categories.length) {
      throw new Error('Users or categories not found. Seed them first.');
    }

    await Blog.deleteMany({});
    console.log('Cleared existing blogs');

    const demoBlogs = [
      {
        title: 'The Future of AI: Trends and Predictions',
        content: 'Artificial Intelligence (AI) is rapidly evolving... [demo content]...',
        excerpt: 'Explore the latest trends and predictions in Artificial Intelligence for the coming decade.',
        author: users[0]._id,
        coverImage: '',
        tags: ['ai', 'technology', 'future'],
        category: categories.find(c => c.name === 'Technology')._id,
        status: 'published',
        isPublished: true,
        publishedAt: new Date(),
        views: 120,
        featured: true,
        likes: [],
        bookmarks: [],
        isDeleted: false
      },
      {
        title: '10 Must-Visit Destinations in 2025',
        content: 'Traveling opens up new horizons... [demo content]...',
        excerpt: 'Discover the top travel destinations you should add to your bucket list for 2025.',
        author: users[1]._id,
        coverImage: '',
        tags: ['travel', 'destinations', 'adventure'],
        category: categories.find(c => c.name === 'Travel')._id,
        status: 'published',
        isPublished: true,
        publishedAt: new Date(),
        views: 85,
        featured: false,
        likes: [],
        bookmarks: [],
        isDeleted: false
      },
      {
        title: 'Healthy Eating: Tips for a Balanced Diet',
        content: 'Maintaining a balanced diet is crucial... [demo content]...',
        excerpt: 'Simple and effective tips to help you eat healthier every day.',
        author: users[2]._id,
        coverImage: '',
        tags: ['health', 'wellness', 'nutrition'],
        category: categories.find(c => c.name === 'Health & Wellness')._id,
        status: 'published',
        isPublished: true,
        publishedAt: new Date(),
        views: 60,
        featured: false,
        likes: [],
        bookmarks: [],
        isDeleted: false
      },
      {
        title: 'Easy Homemade Pasta Recipes',
        content: 'Making pasta at home is easier than you think... [demo content]...',
        excerpt: 'Try these delicious and easy homemade pasta recipes for your next meal.',
        author: users[2]._id,
        coverImage: '',
        tags: ['food', 'cooking', 'recipes'],
        category: categories.find(c => c.name === 'Food & Cooking')._id,
        status: 'published',
        isPublished: true,
        publishedAt: new Date(),
        views: 45,
        featured: false,
        likes: [],
        bookmarks: [],
        isDeleted: false
      },
      {
        title: 'How to Start a Successful Business',
        content: 'Starting a business requires planning... [demo content]...',
        excerpt: 'A step-by-step guide to launching your own business and making it thrive.',
        author: users[0]._id,
        coverImage: '',
        tags: ['business', 'entrepreneurship', 'startup'],
        category: categories.find(c => c.name === 'Business')._id,
        status: 'published',
        isPublished: true,
        publishedAt: new Date(),
        views: 70,
        featured: true,
        likes: [],
        bookmarks: [],
        isDeleted: false
      }
    ];

    // Add slugs
    for (const blog of demoBlogs) {
      blog.slug = slugify(blog.title);
    }

    const blogs = await Blog.insertMany(demoBlogs);
    console.log(`Seeded ${blogs.length} blogs:`);
    blogs.forEach(b => console.log(`- ${b.title}`));
    process.exit(0);
  } catch (error) {
    console.error('Error seeding blogs:', error);
    process.exit(1);
  }
}

seedBlogs(); 