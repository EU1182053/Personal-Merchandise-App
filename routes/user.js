const { isAuthenticated,
    isSignIn,
    isAdmin,
    requestPasswordRecovery,
    validateResetToken,
    updatePassword } = require("../controllers/auth");
const { getUserById,
    getUser,
    updateUser,
} = require("../controllers/user");

// Middleware for common user authentication
const authenticateUser = [isSignIn, isAuthenticated];
const adminMiddleware = [isSignIn, isAuthenticated, isAdmin];

const express = require("express");
const router = express.Router();

// Middleware for user-specific operations
router.param("userId", getUserById);

// User routes
router.get("/user/:userId", authenticateUser, getUser);// Get user details
router.put("/user/:userId", adminMiddleware, updateUser);// Update user details

// Password recovery and reset routes
// Initiate password recovery
router.post("/user/password-recovery", async (req, res, next) => {
    try {
        await requestPasswordRecovery(req, res);
    } catch (error) {
        next(error); // Pass to the error-handling middleware
    }
});
router.post("/user/password-reset/:token", validateResetToken, updatePassword);// Reset password

module.exports = router;
