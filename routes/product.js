const express = require("express");
const router = express.Router();

const Product = require("../models/products");



const { getUserById } = require("../controllers/user");
const {
  getProductById,
  createProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  photo,
  updateProduct,
  getProductPhoto
} = require("../controllers/product");
const { isSignIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const upload = require("../middleware/upload");

// Middleware for authentication
const authenticateUser = [isSignIn, isAuthenticated];
const adminMiddleware = [...authenticateUser, isAdmin];

// Params Middleware
router.param("userId", getUserById);
router.param("productId", getProductById);

// Routes
//create a product
router.post("/product/create", adminMiddleware, createProduct);

// get all the products
router.get("/product/showAll", getAllProducts);

//get a specific product 
router.get("/product/show/:productId",adminMiddleware, getProduct);
 
//delete route 
router.delete("/product/delete/:productId/:userId", adminMiddleware, deleteProduct);

// route for photo
router.get("/product/photo/:productId", getProductPhoto);  
 
     
// route for update
router.put('/product/update/:productId', adminMiddleware,upload.single("photo"), updateProduct )  

  
module.exports = router;
