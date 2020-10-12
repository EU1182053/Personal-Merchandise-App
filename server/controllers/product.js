const Product = require("../models/products");

const formidable = require("formidable");
const fs = require('fs');

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
  .populate('category')
  .exec((err, product) => {
    if (err) {
      return res.json({
        error: "Not Found",
      });
    }

    req.product = product;
    next();
  });
};
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.json({
        error: "problem with Image",
      });
    }
    //compulsion
    let product = new Product(fields);
    const{name, description, stock, price, photo, category } = fields
    // if(!name || !description || !stock || !price || !photo || !category){
    //     return res.json({
    //         error:"All the fields should be filled"
    //     })
    // }

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.json({
          error: "File size is too big!",
        });
      }
      //adding image from the PC
      product.photo.data = fs.readFileSync(file.photo.path)
      product.photo.contentType = product.photo.type
    }

    //save to DB
    product.save((err, product) => {
        if(err){
            return res.json({
                error:"SAving in DB failed"
            })
        }
        return res.json(product)
    })
  });
};
exports.getAllProducts = (req, res) => {
  Product.find()
  .exec((err, products) => {
    if(err){
      return res.json({
        error:"There are no products right now in DB"
      })
    }
    // products.photo = "";
    return res.json(products)
  })
}

exports.getProduct = (req, res) => {
  // req.product.photo = undefined;
  return res.json(req.product);
};
// delete controllers
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product"
      });
    }
    res.json({
      message: "Deletion was a success",
      deletedProduct
    });
  });
};
//middlewares
exports.photo = (req, res, next) => {
  if(req.product.photo.data){
    res.set("Content-Type", req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next()
}
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map(prod => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } }
      }
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed"
      });
    }
    next();
  });
};