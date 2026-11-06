
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
          default: "",
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    price: {
      type: Number,
      default: null,
    },

    compareAtPrice: {
      type: Number,
      default: null,
    },

    currency: {
      type: String,
      default: "INR",
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    weight: {
      type: Number,
      default: null,
    },

    metal: {
      type: String,
      default: null,
    },

    stone: {
      type: String,
      default: null,
    },

    availableSizes: {
      type: [String],
      default: [],
    },

    stockStatus: {
      type: String,
      default: "contact-for-availability",
    },

    tags: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
