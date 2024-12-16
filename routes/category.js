const express = require("express");
const router = express.Router();
const {getUserById} = require('../controllers/user')
const {getCategoryById, createCategory,showAllCategory, updateCategory} = require("../controllers/category");
const {isSignIn, isAuthenticated, isAdmin} = require("../controllers/auth");


// Middleware to extract parameters
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);


// Routes
// Create a new category (Admin only)
router.post("/category/create/:userId",  isSignIn, isAdmin, createCategory);

// Get all categories
router.get("/category/show",   showAllCategory);

// Update a category (Admin only)
router.put("/category/update/:userId/:categoryId",isSignIn,isAuthenticated, isAdmin, updateCategory );

module.exports = router