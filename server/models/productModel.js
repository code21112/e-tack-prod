// const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Schema;

// const productSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       trim: true,
//       minlength: [3, "Name too short"],
//       maxlength: [32, "Name too long"],
//       required: "Product title is required",
//       text: true,
//     },
//     slug: {
//       type: String,
//       trim: true,
//       lowercase: true,
//       index: true,
//     },
//     parent: {
//       type: ObjectId,
//       ref: "Category",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 70,
      required: true,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      maxlength: 32,
      trim: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    subcategories: [
      {
        type: ObjectId,
        ref: "Subcategory",
      },
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    shipping: {
      type: String,
      enum: ["Yes", "No"],
    },
    color: {
      type: String,
      enum: ["Black", "Brown", "Silver", "White", "Blue"],
    },
    brand: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    brand: {
      type: String,
      enum: ["Apple", "Samsung", "Lenovo", "Microsoft", "Asus"],
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
