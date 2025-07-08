import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

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

const User = mongoose.model('User', userSchema);

const demoUsers = [
  {
    username: 'alice',
    email: 'alice@example.com',
    password: 'password123',
    firstName: 'Alice',
    lastName: 'Wonderland',
    bio: 'Tech enthusiast and avid blogger.',
    avatar: '',
    role: 'user',
    isActive: true
  },
  {
    username: 'bob',
    email: 'bob@example.com',
    password: 'password123',
    firstName: 'Bob',
    lastName: 'Builder',
    bio: 'Travel lover and photographer.',
    avatar: '',
    role: 'user',
    isActive: true
  },
  {
    username: 'carol',
    email: 'carol@example.com',
    password: 'password123',
    firstName: 'Carol',
    lastName: 'Smith',
    bio: 'Foodie and recipe creator.',
    avatar: '',
    role: 'user',
    isActive: true
  },
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'adminpass',
    firstName: 'Admin',
    lastName: 'User',
    bio: 'Site administrator.',
    avatar: '',
    role: 'admin',
    isActive: true
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('Cleared existing users');

    // Hash passwords
    for (const user of demoUsers) {
      user.password = await bcrypt.hash(user.password, 12);
    }

    const users = await User.insertMany(demoUsers);
    console.log(`Seeded ${users.length} users:`);
    users.forEach(u => console.log(`- ${u.firstName} ${u.lastName} (${u.email})`));
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers(); 