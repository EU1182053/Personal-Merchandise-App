const express = require("express");
const router = express.Router();
const { isAuthenticated, isSignIn, isAdmin } = require("../controllers/auth");
const { createReview, getAllReviews } = require("../controllers/review");
const { getUserById } = require("../controllers/user");

router.param('userId', getUserById)
router.post("/review/create",  isSignIn, isAuthenticated, createReview);
router.get("/review/:productId",  isAdmin,  getAllReviews);

module.exports = router;
