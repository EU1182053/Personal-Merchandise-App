const express = require("express");
const { check, validationResult } = require("express-validator");

const {
  signup,
  signout,
  signin,
  isSignIn,
  isAuthenticated,
} = require("../controllers/auth");

const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

// Validation rules
const validateSignup = [
  check("email").isEmail().withMessage("Invalid email format"),
  check("password")
    .isLength({ min: 3, max:8 })
    .withMessage("Password minimum length 3 and maximum 8"),
  check("name").isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
];

const validateSignin = [
  check("email").isEmail().withMessage("Invalid email format"),
  check("password")
    .isLength({ min: 3, max:8 })
    .withMessage("Password minimum length 3 and maximum 8"),
];

// Routes
router.post("/user/signup",validateSignup, handleValidationErrors, signup);
router.post("/user/signin", validateSignin, handleValidationErrors, signin);
router.get("/user/signout", signout);


module.exports = router;
