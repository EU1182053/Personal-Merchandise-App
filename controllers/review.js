const Review = require("../models/review");
const Product = require("../models/products");
const { getUserID } = require("./auth");

exports.createReview = async (req, res) => {

  try {
    const { product_id, rating_value, user_id } = req.body;

    // Add the review to the database
    const newReview = new Review({
      
        user_id: user_id, // replace with a valid user ObjectId
        product_id: product_id, // replace with a valid product ObjectId
        rating_value: rating_value
    
      
    });
    await newReview.save();
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ error: "Product Not Found" });
    }

    // update average rating and count
    // Update average rating and count
    const totalRating = product.rating.average * product.rating.count + rating_value;
    product.rating.count += 1;
    product.rating.average = totalRating / product.rating.count;

    // Calculate the new average rating and round it to the nearest integer
    product.rating.average = Math.round(totalRating / product.rating.count);
    await product.save();

    res.json({ message: "Review added and product updated successfully." });

  } catch (error) {
    res.status(400).json({
      error: error
    }); 
  }
  // res.send('signup works')
};

// step 2
exports.getAllReviews = (req, res) => {
  const { productId } = req.params;

  // Find all reviews for the product
  Review.find({ "product_id": productId })
    .populate("user_id", "_id name")
    .then(reviews => {
      if (reviews.length === 0) {
        return res.status(404).json({ message: "No reviews found for this product" });
      }

      
      return res.json({
        reviews: reviews,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: "An error occurred while fetching reviews" });
    });
};

