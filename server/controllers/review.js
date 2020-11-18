const Review = require("../models/review");

exports.createReview = (req, res) => {
    const user = new Review(req.body);
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

