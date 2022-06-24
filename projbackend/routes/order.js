const express = require("express");
var router = express.Router();

const {
  getOrderById,
  createOrder,
  listOrder,
  getStatus,
  updateStatus,
} = require("../controllers/order");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { updateStock } = require("../controllers/product");
const { getUserId, pushOrderInOurchaseList } = require("../controllers/user");

// Params
router.param("orderId", getOrderById);
router.param("userId", getUserId);

// Routes
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInOurchaseList,
  updateStock,
  createOrder
);

router.get(
  "/order/list/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  listOrder
);

// status Route
router.get("order/status/:userId", isSignedIn, isAuthenticated, getStatus);
router.put(
  "order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
