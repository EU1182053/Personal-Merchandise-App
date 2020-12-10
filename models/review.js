var mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

var reviewSchema = new mongoose.Schema({
  data:[{
    product_id:{
      type: ObjectId,
      ref: "Product",
      required: true
    },
    rating_value:{
      type: Number,
      required: true
    }
  }]
});
module.exports = mongoose.model("Review", reviewSchema);