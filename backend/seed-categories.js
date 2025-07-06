import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CategoryModel from './models/Category.js';

dotenv.config();

const categories = [
  {
    name: 'Technology',
    description: 'Latest technology trends and innovations',
    color: '#3B82F6',
    icon: '💻',
    featured: true
  },
  {
    name: 'Programming',
    description: 'Programming tutorials and code examples',
    color: '#10B981',
    icon: '⚡',
    featured: true
  },
  {
    name: 'Design',
    description: 'UI/UX design and creative inspiration',
    color: '#F59E0B',
    icon: '🎨',
    featured: true
  },
  {
    name: 'Business',
    description: 'Business insights and entrepreneurship',
    color: '#8B5CF6',
    icon: '💼',
    featured: false
  },
  {
    name: 'Lifestyle',
    description: 'Personal development and lifestyle tips',
    color: '#EC4899',
    icon: '🌟',
    featured: false
  },
  {
    name: 'Travel',
    description: 'Travel guides and adventure stories',
    color: '#06B6D4',
    icon: '✈️',
    featured: false
  },
  {
    name: 'Food',
    description: 'Recipes and culinary experiences',
    color: '#EF4444',
    icon: '🍕',
    featured: false
  },
  {
    name: 'Health',
    description: 'Health and wellness advice',
    color: '#84CC16',
    icon: '🏥',
    featured: false
  },
  {
    name: 'Education',
    description: 'Learning resources and educational content',
    color: '#F97316',
    icon: '📚',
    featured: false
  },
  {
    name: 'Entertainment',
    description: 'Movies, music, and entertainment news',
    color: '#A855F7',
    icon: '🎬',
    featured: false
  },
  {
    name: 'Other',
    description: 'Miscellaneous topics and general content',
    color: '#6B7280',
    icon: '📝',
    featured: false
  }
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await CategoryModel.deleteMany({});
    console.log('Cleared existing categories');

    // Insert categories one by one to trigger pre-save hooks
    const createdCategories = [];
    for (const categoryData of categories) {
      const category = new CategoryModel(categoryData);
      await category.save();
      createdCategories.push(category);
      console.log(`Created category: ${category.name}`);
    }

    console.log(`\n✅ Successfully created ${createdCategories.length} categories!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories(); 