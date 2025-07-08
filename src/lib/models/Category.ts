import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
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
    const existingCategory = await (this.constructor as typeof CategoryModel).findOne({ slug, _id: { $ne: this._id } });
    if (existingCategory) {
      slug = slug + '-' + Date.now();
    }
    this.slug = slug;
    next();
  } catch (error) {
    next(error as Error);
  }
});

categorySchema.set('toJSON', { virtuals: true });

const CategoryModel = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);
export default CategoryModel; 