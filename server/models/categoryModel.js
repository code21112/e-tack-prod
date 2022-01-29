const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const categorySchema = new mongoose.Schema(
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
      unique: true,
      lowercase: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
