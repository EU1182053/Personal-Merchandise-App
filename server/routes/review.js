const express = require("express");
const router = express.Router();
const { isAuthenticated, isSignIn, isAdmin } = require("../controllers/auth");
const { createReview } = require("../controllers/review");
const { getUserById } = require("../controllers/user");

router.param('userId', getUserById)
router.post("/review/create/:userId",  isSignIn, createReview);

module.exports = router;
