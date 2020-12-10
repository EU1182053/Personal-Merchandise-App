const user = require("../models/user");
const User = require("../models/user");
const Order = require("../models/order");
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.json({
        error: "Not Found",
      });
    }

    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = "";
  req.profile.encry_password = "";
  return res.send(req.profile);
};
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },

    (err, user) => {
      if (err) {
        return res.json({
          error: "You are not authorized to update user",
        });
      }
      user.salt = "";
      user.encry_password = "";
      console.log("object", user);
      res.send(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.json({ error: "No order" });
      }
      return res.send(order);
    });
};
exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases_list = []
    req.body.order.products.forEach(product => {
        purchases_list.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    })
    User.findOneAndUpdate(
        {_id: req.body._id},
        {$push: {purchases: purchases_list}},
        {new: true},
        (err, purchases) => {
            if(err){
                return res.json({
                    err:"Unabel to save purchase list"
                })
            }
            next()
        }
    )
    
}