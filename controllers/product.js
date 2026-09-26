console.log("ENV IN CONTROLLER:", process.env.NODE_ENV);
const Product = require("../models/products");
const config = require("../config");
const tinify = require("tinify");
const fs = require("fs");

tinify.key = config.tinify.apikey;

// ================= GET PRODUCT BY ID =================
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(404).json({ error: "Product Not Found" });
      }
      req.product = product;
      next();
    });
};

// ================= CREATE PRODUCT =================
exports.createProduct = async (req, res) => {
  try {
    const { name, description, stock, price, category } = req.body;

    if (!name || !description || !stock || !price || !category) {
      return res.status(400).json({ error: "All fields must be filled" });
    }

    let product = new Product({
      name,
      description,
      stock,
      price,
      category,
    });

    // ✅ Handle image (multer)
    if (req.file) {
      if (req.file.size > 3 * 1024 * 1024) {
        return res.status(400).json({ error: "File size too large (max 3MB)" });
      }

      const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: "Invalid file type" });
      }

      try {

        let finalBuffer;
        //  Skip Tinify in test environment
        if (process.env.NODE_ENV === "test") {
          finalBuffer = req.file.buffer;
        } else {
          finalBuffer = await tinify
            .fromBuffer(req.file.buffer)
            .toBuffer();
        }

        product.photo.data = finalBuffer;
        product.photo.contentType = req.file.mimetype;
      } catch (err) {
        console.log("TINIFY ERROR:", err); // 
        return res.status(500).json({ error: "Image compression failed" });
      }
    } else {
      return res.status(400).json({ error: "Photo is required" });
    }

    const savedProduct = await product.save();

    res.status(201).json({
      message: "Product created successfully!",
      product: savedProduct,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// ================= GET ALL PRODUCTS =================
exports.getAllProducts = (req, res) => {
  Product.find()
    .select("-photo.data")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No products found",
        });
      }
      return res.json(products);
    });
};

// ================= GET SINGLE PRODUCT =================
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({
      error: "Error fetching product",
    });
  }
};

// ================= GET PRODUCT PHOTO =================
exports.getProductPhoto = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).select("photo");

    if (!product || !product.photo || !product.photo.data) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.set("Content-Type", product.photo.contentType);
    return res.send(product.photo.data);
  } catch (err) {
    return res.status(500).json({ error: "Failed to load image" });
  }
};

// ================= DELETE PRODUCT =================
exports.deleteProduct = (req, res) => {
  let product = req.product;

  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete product",
      });
    }

    res.status(200).json({
      message: "Deletion was a success",
      deletedProduct,
    });
  });
};

// ================= UPDATE PRODUCT =================
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const allowedFields = ["name", "description", "price", "stock", "category"];
    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key];
      }
    });

    // ✅ Handle image update
    if (req.file) {
      product.photo.data = req.file.buffer;
      product.photo.contentType = req.file.mimetype;
    }

    await product.save();

    res.status(200).json({
      message: "Product updated successfully!",
      product,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// ================= UPDATE STOCK =================
exports.updateStock = (req, res, next) => {
  let operations = req.body.order.products.map((prod) => ({
    updateOne: {
      filter: { _id: prod._id },
      update: {
        $inc: { stock: -prod.quantity, sold: +prod.quantity },
      },
    },
  }));

  Product.bulkWrite(operations, {}, (err) => {
    if (err) {
      return res.status(400).json({
        error: err,
        message: "Bulk operation failed",
      });
    }
    next();
  });
};