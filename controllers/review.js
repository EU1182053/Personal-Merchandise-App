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

  // Find all reviews for the product
  Review.find({ "data.product_id": productId })
    .populate("data.user_id", "_id name")
    .then(reviews => {
      if (reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for this product" });
      }

      // Calculate average rating
      const totalRatings = reviews.reduce((sum, review) => {
        // Sum the ratings for this product
        return sum + review.data.reduce((subSum, reviewData) => {
          return subSum + reviewData.rating_value;
        }, 0);
      }, 0);

      const totalReviews = reviews.reduce((sum, review) => {
        // Count the number of reviews for this product
        return sum + review.data.length;
      }, 0);

      const averageRating = totalReviews > 0 ? (totalRatings / totalReviews) : 0;

      return res.json({
        reviews: reviews,
        averageRating: averageRating.toFixed(2), // Optional: toFixed for two decimal places
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: "An error occurred while fetching reviews" });
    });
};

