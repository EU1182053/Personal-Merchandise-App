const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/user");
const {
  getProductById,
  createProduct,
  getAllProducts,
  getProduct,
  deleteProduct,
  photo
} = require("../controllers/product");
const { isSignIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId", getUserById);
router.param("productId", getProductById);

//create a product
router.post("/product/create/:userId", isSignIn, isAdmin, createProduct);

// get all the products
router.get("/product/show",  getAllProducts);

//get a specific product
router.get("/product/show/:productId", getProduct);

//delete route
router.delete("/product/:productId/:userId",deleteProduct);

// route for photo
router.get('/product/photo/:productId', photo)
  
// route for update
router.put('product/update/:productId',updateProduct )  

  
module.exports = router;
