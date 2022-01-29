const express = require("express");
const router = express.Router();

// MIDDLEWARES
const { authCheck, adminCheck } = require("./../middlewares/authMiddleware");

// CONTROLLER
const {
  createSubcategory,
  readSubcategory,
  updateSubcategory,
  removeSubcategory,
  listSubcategories,
  listSubcategoriesSortedAlpha,
  listSubcategoriesByCategorySortedAlpha,
} = require("./../controllers/subcategoryController");

router.post("/subcategory", authCheck, adminCheck, createSubcategory);
router.get("/subcategory/:slug", readSubcategory);
router.put("/subcategory/:slug", authCheck, adminCheck, updateSubcategory);
router.delete("/subcategory/:slug", authCheck, adminCheck, removeSubcategory);

router.get("/subcategories", listSubcategories);
router.get("/subcategories/a-z", listSubcategoriesSortedAlpha);
router.get(
  "/subcategories/category/:categoryId",
  listSubcategoriesByCategorySortedAlpha
);

module.exports = router;
