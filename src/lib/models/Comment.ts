import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  blog: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  parentComment?: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  isDeleted: boolean;
  likeCount: number;
  isLikedBy(userId: mongoose.Types.ObjectId): boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  blog: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  likes: [{
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

// Virtual for like count
commentSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Method to check if user liked the comment
commentSchema.methods.isLikedBy = function(userId: mongoose.Types.ObjectId): boolean {
  return this.likes && this.likes.includes(userId);
};

// Ensure virtuals are serialized
commentSchema.set('toJSON', { virtuals: true });

// Indexes for better performance
commentSchema.index({ blog: 1, createdAt: -1 });
commentSchema.index({ user: 1 });
commentSchema.index({ parentComment: 1 });

const CommentModel = mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);
export default CommentModel; 