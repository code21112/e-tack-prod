const express = require("express");
const router = express.Router();

// MIDDLEWARE
const { authCheck } = require("./../middlewares/authMiddleware");

// CONTROLLER METHODS
const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
  getUserOrders,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  createCashOrder,
} = require("./../controllers/userController");

router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, emptyCart);

router.post("/user/address", authCheck, saveAddress);

// Discount coupon
router.post("/user/cart/coupon", authCheck, applyCouponToUserCart);

// Orders
router.post("/user/order", authCheck, createOrder);
router.get("/user/orders", authCheck, getUserOrders);
router.post("/user/cash-order", authCheck, createCashOrder);

// Wishlist
router.post("/user/wishlist", authCheck, addToWishlist);
router.get("/user/wishlist", authCheck, getWishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

module.exports = router;
