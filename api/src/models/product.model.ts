import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  seller: mongoose.Types.ObjectId; // Reference to User
  title: string;
  description: string;
  category: mongoose.Types.ObjectId; // Reference to Category
  images: string[];
  video?: string;
  price: number;
  unit: string; // e.g., "kg", "lbs", "dozen", "piece"
  quantityAvailable: number;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  isOrganic: boolean;
  harvestDate?: Date;
  status: 'available' | 'out-of-stock' | 'removed';
  tags: string[];
  views: number;
  buys: number;
  rating: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },
    images: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0 && v.length <= 10;
        },
        message: 'Product must have between 1 and 10 images',
      },
    },
    video: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['kg', 'lbs', 'dozen', 'piece', 'bunch', 'bag', 'box', 'liter'],
    },
    quantityAvailable: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    harvestDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['available', 'out-of-stock', 'removed'],
      default: 'available',
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    buys:{
        type: Number,
        default: 0,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
productSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);