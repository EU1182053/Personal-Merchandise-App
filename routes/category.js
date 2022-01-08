const express = require("express");
const router = express.Router();
const {getUserById} = require('../controllers/user')
const {getCategoryById, createCategory,showAllCategory, updateCategory} = require("../controllers/category");
const {isSignIn, isAuthenticated, isAdmin} = require("../controllers/auth");



router.param("userId", getUserById);
router.param("categoryId", getCategoryById);



router.post("/category/create/:userId",  isSignIn, createCategory);
router.get("/category/show", isAuthenticated,  showAllCategory);
router.put("/category/update/:userId/:categoryId",isSignIn, isAdmin, updateCategory )

module.exports = router