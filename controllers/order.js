const { Order, ProductCart } = require("../models/order");
const User = require("../models/user");
const { isAuthenticated, getUserID } = require("./auth");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "NO order found in DB"
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
   
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        Message:"Failed to save your order in DB",
        error: err.message
      });
    }
    res.json(order); 
  });
};

exports.getAllOrders = async(req, res) => {
  const userId = req.params.userId; // Correctly access userId from route parameters
  try {
    const orders = await User.findById( userId )  

    if (orders["purchases"].length === 0) {
      return res.status(404).json({ error: "No orders found for this user" });
    } 
 
    return res.json(orders); // Return the orders if found
  } catch (err) {
    console.error("Error fetching orders:", err); // Log error for debugging
    return res.status(500).json({ error: "Something went wrong while fetching orders" });
  }
};



exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

