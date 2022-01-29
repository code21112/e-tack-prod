const express = require("express");

const router = express.Router();

const {
  createOrUpdateUser,
  currentUser,
} = require("./../controllers/authController");

// MIDDLEWARES
const { authCheck, adminCheck } = require("./../middlewares/authMiddleware");

// CONTROLLER
router.post("/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/current-user", authCheck, currentUser);
router.post("/current-admin", authCheck, adminCheck, currentUser);

module.exports = router;
