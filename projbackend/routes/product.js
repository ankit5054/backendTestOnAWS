const express = require("express");
var router = express.Router();
const {
  getProductById,
  createProduct,
  getproduct,
  photo,
  updateProduct,
  removeProduct,
  getallproducts,
  getAllUniqueCategories,
} = require("../controllers/product");
const { getUserId } = require("../controllers/user");
const { isAdmin, isSignedIn, isAuthenticated } = require("../controllers/auth");

// Params
router.param("userId", getUserId);
router.param("productId", getProductById);

// Routes

// Create Routes
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

// Read Routes
router.get("/product/:productId", getproduct);
router.get("/product/photo/:productId", photo);

// Update Routes
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

// Delete Routes
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeProduct
);

// Listing Routes
router.get("/product/all", getallproducts);

router.get("/products/categories", getAllUniqueCategories);
module.exports = router;
