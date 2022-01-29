const express = require("express");
const router = express.Router();

// MIDDLEWARES
const { authCheck, adminCheck } = require("./../middlewares/authMiddleware");

const {
  getOrders,
  updateOrderStatus,
} = require("./../controllers/adminController");

router.get("/admin/orders", authCheck, adminCheck, getOrders);
router.put("/admin/order-status", authCheck, adminCheck, updateOrderStatus);

module.exports = router;
