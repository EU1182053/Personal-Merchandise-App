const Product = require("../models/products");

const formidable = require("formidable");
const fs = require('fs');

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate('category') 
    .exec((err, product) => {
      if (err) {
        return res.json({
          error: "Product Not Found",
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
          error: "product SAving in DB failed"
        })
      }
      return res.status(200).json({
        message: "Product created successfully!",
        product: product,
      });
    })
  });
};
exports.getAllProducts = (req, res) => {
  Product.find()
    .select("-photo") // Exclude the 'photo' field
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "There are no products right now in DB",
        });
      }
      return res.json(products);
    });
};

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
        error: err,
        message: "Bulk operation failed"
      });
    }
    // console.log(products)
    next();
  });
};


exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId; // Get product ID from request parameters
    const updatedData = req.body; // Get update data from request body

    // Update product and return the updated document
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updatedData },  
      { new: true } // Returns the updated document
    );

    // If no product found, send a 404 error
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return the updated product
    return res.status(200).json(updatedProduct);
  } catch (error) { 
    // Log and return server error
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
