const express = require("express");
const router = express.Router();
const { isAuthenticated, isSignIn, isAdmin } = require("../controllers/auth");
const { createReview, getAllReviews } = require("../controllers/review");
const { getUserById } = require("../controllers/user");

const authenticateUser = [isSignIn, isAuthenticated];
const adminMiddleware = [isAuthenticated, isAdmin];


router.param('userId', getUserById)
router.post("/review/create/:userId",  isSignIn, isAuthenticated, createReview);

// step 1
router.get("/review/:productId",  adminMiddleware,  getAllReviews);
 
module.exports = router;
