import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface ILike {
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: mongoose.Types.ObjectId | IUser;
  coverImage?: string;
  tags: string[];
  category: mongoose.Types.ObjectId;
  status: 'draft' | 'published';
  isPublished: boolean;
  publishedAt?: Date;
  views: number;
  featured: boolean;
  likes: ILike[];
  bookmarks: mongoose.Types.ObjectId[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>({
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
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  bookmarks: [{
    type: Schema.Types.ObjectId,
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

// Generate slug before saving
blogSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  });
  next();
});

blogSchema.set('toJSON', { virtuals: true });

const BlogModel = mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);
export default BlogModel; 