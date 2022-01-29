// const express = require("express");

// const router = express.Router();

// router.get("/products", (req, res) => {
//   res.json({ data: "You just hit the products API endpoint" });
// });

// module.exports = router;

// const express = require("express");
// const router = express.Router();

// // MIDDLEWARES
// const { authCheck, adminCheck } = require("./../middlewares/authMiddleware");

// // CONTROLLER
// const {
//   createProduct,
//   readProduct,
//   updateProduct,
//   removeProduct,
//   listProducts,
//   listProductsSortedAlpha,
// } = require("./../controllers/productController");

// router.post("/product", authCheck, adminCheck, createProduct);
// router.get("/product/:slug", readProduct);
// router.put("/product/:slug", authCheck, adminCheck, updateProduct);
// router.delete("/product/:slug", authCheck, adminCheck, removeProduct);

// router.get("/products", listProducts);
// router.get("/products/a-z", listProductsSortedAlpha);

// module.exports = router;

const express = require("express");
const router = express.Router();

// MIDDLEWARES
const { authCheck, adminCheck } = require("./../middlewares/authMiddleware");

// CONTROLLER
const {
  createProduct,
  readProduct,
  updateProduct,
  removeProduct,
  listAll,
  list,
  productsCount,
  productStar,
  listRelated,
  searchFilters,
} = require("./../controllers/productController");

router.post("/product", authCheck, adminCheck, createProduct);
router.get("/product/:slug", readProduct);
router.put("/product/:slug", authCheck, adminCheck, updateProduct);
router.delete("/product/:slug", authCheck, adminCheck, removeProduct);

router.get("/products/total", productsCount);
router.get("/products/:count", listAll);
router.post("/products", list);

router.put("/product/star/:productId", authCheck, productStar);
// related
router.get("/product/related/:productId", listRelated);

router.post("/search/filters", searchFilters);

module.exports = router;
