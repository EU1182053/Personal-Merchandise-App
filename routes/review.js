const express = require("express");
const router = express.Router();
const { isAuthenticated, isSignIn, isAdmin } = require("../controllers/auth");
const { createReview, getAllReviews, getReviewsByProducts } = require("../controllers/review");
const { getUserById } = require("../controllers/user");

const authenticateUser = [isSignIn, isAuthenticated];
const adminMiddleware = [isAuthenticated, isAdmin];


router.param('userId', getUserById)
router.post("/review/create/:userId",  authenticateUser, createReview);


router.post("/review/getByProducts", authenticateUser, getReviewsByProducts);

module.exports = router;
