const express = require("express");
const router = express.Router();
const {getUserById} = require('../controllers/user')
const {getCategoryById, createCategory,showAllCategory, updateCategory} = require("../controllers/category");
const {isSignIn, isAuthenticated, isAdmin} = require("../controllers/auth");

// Middleware for common user authentication
const authenticateUser = [isSignIn, isAuthenticated];
const adminMiddleware = [isAuthenticated, isAdmin];

// Middleware to extract parameters
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);


// Routes
// Create a new category (Admin only)
router.post("/category/create/:userId",  isAdmin, createCategory);

// Get all categories
router.get("/category/show",   showAllCategory);

// Update a category (Admin only)
router.put("/category/update/:userId/:categoryId",adminMiddleware, updateCategory );

module.exports = router