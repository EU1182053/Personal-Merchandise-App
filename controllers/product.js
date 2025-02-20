const Product = require("../models/products");
const config = require("../config")
const tinify = require("tinify");
tinify.key = config.tinify.apikey; // 🔹 Set Your API Key

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
exports.createProduct = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, file) => {
    if (err) {
      return res.status(400).json({ error: "Problem with image upload" });
    }

    const { name, description, stock, price, category } = fields;
    if (!name || !description || !stock || !price || !category) {
      return res.status(400).json({ error: "All fields must be filled" });
    }

    let product = new Product(fields);

    if (file.photo && file.photo.size > 0) {
      if (file.photo.size > 3 * 1024 * 1024) {
        return res.status(400).json({ error: "File size is too large (max: 3MB)" });
      }

      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedTypes.includes(file.photo.type)) {
        return res.status(400).json({ error: "Invalid file type. Use PNG, JPEG, or WebP." });
      }

      try {
        const fileBuffer = fs.readFileSync(file.photo.path);
        const compressedBuffer = await tinify.fromBuffer(fileBuffer).toBuffer();

        // Save compressed image
        product.photo.data = compressedBuffer;
        product.photo.contentType = file.photo.type;

      } catch (fileError) { 
        return res.status(500).json({ error: "Error processing image with TinyPNG" });
      }
    }

    try {
      const savedProduct = await product.save();

      // Get compressed image size
      const compressedSize = Buffer.byteLength(savedProduct.photo.data);
      const compressedSizeInKB = (compressedSize / 1024).toFixed(2); // KB
      const compressedSizeInMB = (compressedSize / (1024 * 1024)).toFixed(2); // MB

      res.status(201).json({
        message: "Product created successfully!",
        originalSize: (file.photo.size / (1024 * 1024)).toFixed(2) + " MB",
        compressedSize: compressedSizeInMB + " MB",
        compressedSizeKB: compressedSizeInKB + " KB",
        product: savedProduct,
      });
    } catch (dbError) {
      res.status(500).json({ error: "Failed to save product in database" });
    }
  });
};
exports.getAllProducts = (req, res) => {
  Product.find()
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
  // req.product.photo = undefined
};

exports.getProductPhoto = async(req, res) => {
  try {
    const product = await Product.findById(req.params.productId).select("photo");
    if (!product || !product.photo || !product.photo.data) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.set("Content-Type", product.photo.contentType);
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"); // 🚀 Disable caching
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    return res.send(product.photo.data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load image" });
  }
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
    res.status(200).json({
      message: "Deletion was a success",
      deletedProduct
    });
  });
};
//middlewares
exports.photo = (req, res) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  else{
    return res.send({"req.product.photo.data":"data"})
  }
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
    let product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
  
    // Allowed fields for update
    const allowedFields = ["name", "description", "price", "stock", "category","sold"];
    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key];
      }
    });
 
 
    // ✅ Update image if uploaded
    if (req.file) {
      product.photo.data = req.file.buffer;
      product.photo.contentType = req.file.mimetype;
    } else {
      console.log("No file received");
    }
  
    await product.save();
    res.status(200).json({ message: "Product updated successfully!", product });
  
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
  
};
