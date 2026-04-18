import mongoose, { Schema, model, models } from 'mongoose';

// 1. SiteConfig Schema
const SiteConfigSchema = new Schema({
  businessName: { type: String, required: true },
  description: String,
  logo: String,
  logoSize: Number,
  fontFamily: String,
  coverImage: String,
  whatsappNumber: String,
  address: String,
  workingHours: String,
  phone: String,
  instagram: String,
  twitter: String,
  facebook: String,
  snapchat: String,
  tiktok: String,
  youtube: String,
  linkedin: String,
  telegram: String,
  backupEmail: String,
  offersTitle: String,
  themeMode: { type: String, default: 'dark' },
  theme: {
    primaryColor: String,
    secondaryColor: String,
    backgroundColor: String,
    textColor: String,
    cardBackgroundColor: String,
    buttonColor: String,
    headerBackgroundColor: String,
    footerBackgroundColor: String,
  }
});

// 2. Category Schema
const CategorySchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  icon: String,
  order: { type: Number, default: 0 }
});

// 3. Item Schema
const ItemSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  categoryId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: String,
  price: String,
  image: String,
  extraInfoLabel: String,
  extraInfoValue: String,
  badge: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true, index: true },
  isPopular: { type: Boolean, default: false, index: true }
});

// 4. OfferBanner Schema
const OfferBannerSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: String,
  image: String,
  linkUrl: String,
  isActive: { type: Boolean, default: true, index: true }
});

// 5. Order Schema
const OrderSchema = new Schema({
  id: { type: String, required: true, unique: true, index: true },
  date: { type: Date, default: Date.now, index: true },
  customer: {
    name: String,
    phone: String,
    address: String,
    notes: String,
    type: String, // dineIn, takeaway
    tableNum: String
  },
  items: [
    {
      itemId: String,
      title: String,
      price: String,
      quantity: Number
    }
  ],
  totalAmount: Number,
  status: { type: String, default: 'pending', index: true }
});

export const SiteConfigModel = models.SiteConfig || model('SiteConfig', SiteConfigSchema);
export const CategoryModel = models.Category || model('Category', CategorySchema);
export const ItemModel = models.Item || model('Item', ItemSchema);
export const OfferBannerModel = models.OfferBanner || model('OfferBanner', OfferBannerSchema);
export const OrderModel = models.Order || model('Order', OrderSchema);
