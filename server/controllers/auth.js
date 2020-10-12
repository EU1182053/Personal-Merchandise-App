const User = require("../models/user");
// const {authenticate} = require('../models/user')
const { validationResult } = require("express-validator");
const user = require("../models/user");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
// const err = () => {
//     for (i = 0; i < errors.array().length(); i++) {
//       console.log(errors.array()[i]);
//     }
//   };

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({error: errors.array()[0].msg});
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "stopped",
      });
    }
    res.json(user);
  });
  // res.send('signup works')
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successful",
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array());
  }
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.json({
        error: "User does not exists",
      });
    }

    if (!user.authenticate(password)) {
      return res.json({
        error: "password does not match.",
      });
    }

    // creating a token
    var token = jwt.sign({ _id: user._id }, process.env.SECRET);

    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // send response to front end
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};

//protected route
exports.isSignIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

// custom middlewares
// is Authenticated remaining sec-7 v-7


exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id === req.auth._id
  if(!checker){
    return res.json({
      error:"ACCESS DENIED"
    })
  }
  
  next()
}

exports.isAdmin = (req, res, next) => {
  if (!req.profile.role === 1) {
    return res.json({
      error: "YOU ARE NOT AN ADMIN",
    });
  }

  next();
};
