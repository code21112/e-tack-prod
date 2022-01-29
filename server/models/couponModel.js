const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: true,
      minlength: [6, "Name too short, it must be 6 characters long at least."],
      maxlength: [
        15,
        "Name too long, it cannot be more than 15 characters long.",
      ],
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      min: 1,
      max: 99,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
