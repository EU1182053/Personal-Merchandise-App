const { isAuthenticated, isSignIn , isAdmin, recover, reset, resetPassword} = require("../controllers/auth");
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
router.post("/user/recover", recover)
router.get("/user/reset/:token", reset)
router.post("/user/reset/:token", resetPassword)

module.exports = router;
 