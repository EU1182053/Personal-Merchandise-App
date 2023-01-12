const User = require("../models/user");
// const {authenticate} = require('../models/user')
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
var jwt_deocde = require("jwt-decode");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ error: errors.array()[0].msg });
  }

  
  var email = req.body.email;
  
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      const user = new User(req.body);
      user.save((err, user) => {
        if (err) {
          return res.status(400).json({
            Message: err.message,
          });
        }
        res.json(user);
      });
    }
    else{
      return res.status(400).json({
        Message: "Email exists",
      });
    }
  })
  
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

exports.getUserID = (req, res) => { 
  console.log(req)
  jwt_token = req.headers.authorization.split(' ')[1]
  console.log(jwt_token)

  jwt_token = jwt_deocde(jwt_token)
  return jwt_token._id
}
 
exports.isAuthenticated = (req, res, next) => {
  jwt_token = req.headers.authorization.split(' ')[1]

  jwt_token = jwt_deocde(jwt_token)  
  User.findById(jwt_token, (err, data) => {
    if (err) {
      return res.json({
        error: "Do the Sign In First."
      })
    }
    next() 
  })
} 

exports.isAdmin = (req, res, next) => {
  jwt_token = req.headers.authorization.split(' ')[1]
  jwt_token = jwt_deocde(jwt_token)
  User.findById(jwt_token, (err, data) => {
    if (err || data.role !== 1) {
      return res.json({
        error: data
      })
    }
    next()
  })
};

exports.recover = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.' });
      //Generate and set password reset token
      user.generatePasswordReset();
      // Save the updated user object
      user.save()
        .then(user => {
          // send email
          let link = "http://" + req.headers.host + "/api/user/reset/" + user.resetPasswordToken;
          const mailOptions = {
            to: user.email,
            from: process.env.FROM_EMAIL,
            subject: "Password change request",
            text: `Hi ${user.name} \n 
                  Please click on the following link ${link} to reset your password. \n\n 
                  If you did not request this, please ignore this email and your password will remain unchanged.\n`,
          };
          return res.status(200).json({ message: 'A reset email has been sent to ' + user.email + '.' });
          // sgMail.send(mailOptions, (error, result) => {
          //   if (error) return res.status(500).json({ Message: error.message });

          //   res.status(200).json({ message: 'A reset email has been sent to ' + user.email + '.' });
          // });
        })
        .catch(err => res.status(500).json({ message: err.message }));
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

exports.reset = (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
    .then((user) => {
      if (!user) return res.status(401).json({ message: 'Password reset token is invalid or has expired.' });
      //Redirect user to form with the email address
      return res.json({ Message: "Token is valid." });
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

exports.resetPassword = (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } })
    .then((user) => {
      if (!user) return res.status(401).json({ message: 'Password reset token is invalid or has expired.' });

      //Set the new password
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      // Save
      user.save((err) => {
        if (err) return res.status(500).json({ message: err.message });

        // send email
        const mailOptions = {
          to: user.email,
          from: process.env.FROM_EMAIL,
          subject: "Your password has been changed",
          text: `Hi ${user.name} \n 
                  This is a confirmation that the password for your account ${user.email} has just been changed.\n`
        };
        return res.status(200).json({ message: 'Your password has been updated.' });
        // sgMail.send(mailOptions, (error, result) => {
        //     if (error) return res.status(500).json({message: error.message});

        //     res.status(200).json({message: 'Your password has been updated.'});
        // });
      });
    });
};