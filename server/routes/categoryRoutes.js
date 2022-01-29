const express = require("express");
const router = express.Router();

// MIDDLEWARES
const { authCheck, adminCheck } = require("./../middlewares/authMiddleware");

// CONTROLLER
const {
  createCategory,
  readCategory,
  updateCategory,
  removeCategory,
  listCategories,
  listCategoriesSortedAlpha,
  getSubcategories,
} = require("./../controllers/categoryController");

router.post("/category", authCheck, adminCheck, createCategory);
router.get("/category/:slug", readCategory);
router.put("/category/:slug", authCheck, adminCheck, updateCategory);
router.delete("/category/:slug", authCheck, adminCheck, removeCategory);
router.get("/category/subcategories/:_id", getSubcategories);

router.get("/categories", listCategories);
router.get("/categories/a-z", listCategoriesSortedAlpha);

module.exports = router;
