import mongoose from "mongoose";
import slugify from "slugify";

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

// Generate slug before saving
categorySchema.pre('save', async function(next) {
  if (!this.isModified('name')) return next();
  try {
    let slug = slugify(this.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
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

categorySchema.set('toJSON', { virtuals: true });

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel; 