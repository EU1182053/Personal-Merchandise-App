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
    const { name, description, stock, price, photo, category } = fields
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
      if (err) {
        return res.json({
          error: "SAving in DB failed"
        })
      }
      return res.status(200).send();
    })
  });
};
exports.getAllProducts = (req, res) => {
  Product.find()
    .exec((err, products) => {
      if (err) {
        return res.json({
          error: "There are no products right now in DB"
        })
      }
      products.photo = undefined;
      return res.json(products)
    })
}

exports.getProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    // Find product by productId
    const product = await Product.findById(productId);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Optionally, you can exclude sensitive fields, like `photo` (if you need to)
    // product.photo = undefined;

    return res.json(product); // Send the product data as the response
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ error: 'An error occurred while fetching the product' });
  }
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
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next()
}
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map(prod => {
    console.log("prod", prod)
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.quantity, sold: +prod.quantity } }
      }
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed"
      });
    }
    // console.log(products)
    next();
  });
};


exports.updateProduct = (req, res) => {

  const query = req.body._id;

  Product.findByIdAndUpdate(query, req.body, { overwrite: true }, function (err, doc) {
    if (err) return res.send(500, { error: err });
    return res.send(doc).json();
  });
} 
