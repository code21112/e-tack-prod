const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [3, "Name too short"],
      maxlength: [32, "Name too long"],
      required: "Name is required",
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    parent: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subcategory", subcategorySchema);
