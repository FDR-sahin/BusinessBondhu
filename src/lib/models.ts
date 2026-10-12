import mongoose, { Schema, Model } from 'mongoose';

/* ---------------- Reply & Comment Schema ---------------- */
const ReplySchema = new Schema({
  id: { type: String, default: () => `r-${Date.now()}` },
  authorId: { type: String, default: '' },
  authorName: { type: String, default: 'উদ্যোক্তা' },
  authorRole: { type: String, default: 'ভিজিটর' },
  authorEmail: { type: String, default: '' },
  authorAvatar: { type: String, default: '' },
  comment: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
});

const CommentSchema = new Schema({
  id: { type: String, default: () => `c-${Date.now()}` },
  authorId: { type: String, default: '' },
  authorName: { type: String, default: 'উদ্যোক্তা' },
  authorRole: { type: String, default: 'ভিজিটর' },
  authorEmail: { type: String, default: '' },
  authorAvatar: { type: String, default: '' },
  comment: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
  replies: [ReplySchema],
});

/* ---------------- Business Idea / Post Schema ---------------- */
const BusinessIdeaSchema = new Schema(
  {
    customId: { type: String, index: true },
    title: { type: String, required: true },
    slug: { type: String },
    category: { type: String, default: 'সাধারণ' },
    division: { type: String, default: 'Dhaka' },
    district: { type: String, default: 'ঢাকা' },
    area: { type: String, default: '' },
    upazilaOrArea: { type: String, default: '' },
    exactLocation: { type: String, default: 'ঢাকা, বাংলাদেশ' },
    wholesalePrice: { type: Number, default: 0 },
    wholesalePriceMax: { type: Number },
    wholesalePriceText: { type: String },
    retailPrice: { type: Number, default: 0 },
    retailPriceMax: { type: Number },
    retailPriceText: { type: String },
    retailSellPrice: { type: Number, default: 0 },
    unit: { type: String, default: 'প্রতি পিস' },
    moq: { type: String, default: '১০ পিস' },
    profitPotential: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    description: { type: String, default: '' },
    supplierTip: { type: String, default: '' },
    image: { type: String, default: '/images/ideas/default.jpg' },
    tags: { type: [String], default: [] },
    coordinates: {
      lat: { type: Number, default: 23.8583 },
      lng: { type: Number, default: 90.2667 },
    },
    isVerified: { type: Boolean, default: true },
    verificationBadgeText: { type: String, default: 'ভেরিফায়েড প্রজেক্ট' },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'approved',
      index: true,
    },
    userId: { type: String, default: '', index: true },
    authorEmail: { type: String, default: '', index: true },
    authorPhone: { type: String, default: '' },
    author: {
      id: { type: String, default: '' },
      name: { type: String, default: 'উদ্যোক্তা অ্যাডমিন' },
      avatar: { type: String, default: '/images/avatars/default.jpg' },
    },
    postedBy: {
      name: { type: String, default: 'উদ্যোক্তা অ্যাডমিন' },
      role: { type: String, default: 'অ্যাডমিন' },
      email: { type: String, default: '' },
      isVerifiedUser: { type: Boolean, default: true },
    },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
    dislikedBy: { type: [String], default: [] },
    viewsCount: { type: Number, default: 15 },
    comments: [CommentSchema],
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* ---------------- Blog Schema ---------------- */
const BlogSchema = new Schema(
  {
    customId: { type: String, index: true },
    title: { type: String, required: true },
    slug: { type: String, index: true },
    category: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    image: { type: String, default: '' },
    author: { type: String, default: 'উদ্যোক্তা' },
    authorTitle: { type: String, default: 'উদ্যোক্তা ও লেখক' },
    readTime: { type: String, default: '৫ মিনিট' },
    readingTime: { type: Number, default: 5 },
    bulletPoints: { type: [String], default: [] },
    actionChecklist: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
      index: true,
    },
    userId: { type: String, default: '', index: true },
    authorEmail: { type: String, default: '', index: true },
    likes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
    comments: [CommentSchema],
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* ---------------- User Schema ---------------- */
const UserSchema = new Schema(
  {
    customId: { type: String, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String },
    password: { type: String },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    division: { type: String, default: '' },
    district: { type: String, default: '' },
    area: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isBlocked: { type: Boolean, default: false, index: true },
    blockedAt: { type: String, default: '' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* ---------------- Saved / Bookmark Item Schema ---------------- */
const SavedItemSchema = new Schema(
  {
    userId: { type: String, default: '', index: true },
    userEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    postId: { type: String, required: true, index: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);
SavedItemSchema.index({ userEmail: 1, postId: 1 }, { unique: true });

/* ---------------- Notification Schema ---------------- */
const NotificationSchema = new Schema(
  {
    customId: { type: String, index: true },
    id: { type: String, default: () => `notif-${Date.now()}` },
    recipientUserId: { type: String, default: '', index: true },
    recipientUserEmail: { type: String, default: '', lowercase: true, trim: true, index: true },
    type: {
      type: String,
      enum: ['like', 'comment', 'reply', 'admin', 'system'],
      default: 'system',
    },
    title: { type: String, default: '' },
    message: { type: String, required: true },
    postId: { type: String, default: '' },
    read: { type: Boolean, default: false, index: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
  }
);

/* ---------------- Model Exports ---------------- */
export const BusinessIdeaModel: Model<any> =
  mongoose.models.BusinessIdea || mongoose.model('BusinessIdea', BusinessIdeaSchema);

export const BlogModel: Model<any> =
  mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

export const UserModel: Model<any> =
  mongoose.models.User || mongoose.model('User', UserSchema);

export const SavedItemModel: Model<any> =
  mongoose.models.SavedItem || mongoose.model('SavedItem', SavedItemSchema);

export const NotificationModel: Model<any> =
  mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);


