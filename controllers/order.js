const { Order, ProductCart } = require("../models/order");
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

exports.getAllOrders = (req, res) => {
  const { userId } = req.params.userId;  // Get the userId from the route parameter

  Order.find({ user: userId })  // Find orders where the user field matches the provided userId
    .populate("user", "_id name")  // Populate user details (optional)
    .exec((err, orders) => {  // Handle the query result
      if (err) {
        return res.status(400).json({
          error: "No orders found for this user"  // Adjust error message for clarity
        });
      }
      res.json(orders);  // Return the found orders
    });
};


exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Cannot update order status"
        });
      }
      res.json(order);
    }
  );
};