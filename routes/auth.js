const express = require("express");
const cors = require('cors')

const { signup, signout, signin, isSignIn, isAdmin, isAuthenticated} = require("../controllers/auth");
const { check, validationResult } = require("express-validator");
var router = express.Router();

router.post(
  "/signup",
 
  [
    check("email").isEmail(),

    check("password").isLength({ min: 3 }),

    check("name").isLength({ min: 3 }),
  ],
  

  signup
);

router.post(
  "/signin",

  [
    check("email").isEmail(),

    check("password").isLength({ min: 3 }),

   
  ],
  signin
);

router.get("/signout", () => {
  signout;
}); 

router.get("/testroute",  isSignIn, isAuthenticated,(req, res) => {
  res.send('testroute works successfully')
}
  
);


router.get("/",  (req, res) => {
  res.send(" api page");
});

module.exports = router;
