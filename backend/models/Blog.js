import mongoose from "mongoose";
import slugify from "slugify";

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
    type: String,
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
  featured: {                        // ✅ Add this field
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

const BlogModel = mongoose.model("Blog", blogSchema);
export default BlogModel; 