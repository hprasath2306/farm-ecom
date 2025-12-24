import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  order: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId; // Buyer who is reviewing
  reviewee: mongoose.Types.ObjectId; // Seller being reviewed
  rating: number;
  comment?: string;
  images?: string[];
  response?: {
    text: string;
    date: Date;
  };
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reviewee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    images: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return !v || v.length <= 5;
        },
        message: 'Cannot upload more than 5 images',
      },
    },
    response: {
      text: String,
      date: Date,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ order: 1, product: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', reviewSchema);