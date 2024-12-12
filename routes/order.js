const express = require("express");
const router = express.Router();
const { isSignIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");
const {
  getOrderById, 
  createOrder,
  getAllOrders, 
  getOrderStatus,
   
} = require("../controllers/order");

// Middleware for common user authentication
const authenticateUser = [isSignIn, isAuthenticated];
const adminMiddleware = [isAuthenticated, isAdmin];


//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Actual routes
//create
router.post(
  "/order/create/:userId", 
  authenticateUser,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);
//read
router.get(
  "/order/all/:userId",
  authenticateUser,
  getAllOrders 
);  

//status of order
router.get(
  "/order/status/:userId",
  
 authenticateUser,
 
  getOrderStatus
);


module.exports = router;
