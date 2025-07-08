import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Category schema (simplified for seeding)
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

const Category = mongoose.model('Category', categorySchema);

const demoCategories = [
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Latest tech trends, programming, and digital innovations',
    color: '#3B82F6'
  },
  {
    name: 'Travel',
    slug: 'travel',
    description: 'Adventure stories, travel tips, and destination guides',
    color: '#10B981'
  },
  {
    name: 'Food & Cooking',
    slug: 'food-cooking',
    description: 'Recipes, cooking tips, and culinary adventures',
    color: '#F59E0B'
  },
  {
    name: 'Health & Wellness',
    slug: 'health-wellness',
    description: 'Fitness, nutrition, and mental health tips',
    color: '#EF4444'
  },
  {
    name: 'Business',
    slug: 'business',
    description: 'Entrepreneurship, marketing, and business insights',
    color: '#8B5CF6'
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Personal development, productivity, and life hacks',
    color: '#EC4899'
  },
  {
    name: 'Science',
    slug: 'science',
    description: 'Scientific discoveries, research, and explanations',
    color: '#06B6D4'
  },
  {
    name: 'Arts & Culture',
    slug: 'arts-culture',
    description: 'Art, music, literature, and cultural discussions',
    color: '#84CC16'
  }
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert demo categories
    const categories = await Category.insertMany(demoCategories);
    console.log(`Successfully seeded ${categories.length} categories:`);
    
    categories.forEach(category => {
      console.log(`- ${category.name} (${category.color})`);
    });

    console.log('\nCategories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories(); 