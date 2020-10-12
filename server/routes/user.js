const { isAuthenticated, isSignIn , isAdmin} = require("../controllers/auth");
const { getUserById,
        getUser,
        updateUser,
        userPurchaseList } = require("../controllers/user");
const express = require("express");
const router = express.Router();

router.param("userId", getUserById);
router.get("/user/:userId",  isSignIn,isAuthenticated, getUser);
router.put("/user/:userId",  isSignIn,isAuthenticated, isAdmin, updateUser)
router.put("order/user/:userId",  isSignIn,isAuthenticated, userPurchaseList)

module.exports = router;
