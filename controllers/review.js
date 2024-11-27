const Review = require("../models/review");
const { getUserID } = require("./auth");

exports.createReview = (req, res) => {

  const user = new Review(req.body);
  user.user_id = getUserID;
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: err.message,
      });
    }
    res.json(user);
  });
  // res.send('signup works')
};
   

exports.getAllReviews = (req, res) => {
  const { productId } = req.params;
  
  Review.find({ "data.product_id": productId })
  .populate("data.user_id", "_id name")
  .then(data => {
    return res.json(data)
  })
  .catch((e) =>{
    return res.send(e)
  } )
}
