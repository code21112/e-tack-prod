const express = require("express");
const router = express.Router();

// MIDDLEWARES
const { authCheck, adminCheck } = require("./../middlewares/authMiddleware");

// CONTROLLER
const {
  createCoupon,
  removeCoupon,
  listCoupons,
  listCouponsSortedAlpha,
} = require("./../controllers/couponController");

router.post("/coupon", authCheck, adminCheck, createCoupon);
router.delete("/coupon/:couponId", authCheck, adminCheck, removeCoupon);

router.get("/coupons", listCoupons);
router.get("/coupons/a-z", listCouponsSortedAlpha);

module.exports = router;
