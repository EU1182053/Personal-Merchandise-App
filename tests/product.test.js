process.env.NODE_ENV = "test";

jest.setTimeout(20000);
require('dotenv').config();
const request = require("supertest");
const { app, connectDB } = require('../index');
const mongoose = require("mongoose");
const Product = require("../models/products");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const config = require("../config");


let adminUser;

describe("Product Routes", () => {
  let userToken, adminId;

  beforeAll(async () => {
    await connectDB();
    //create a admin user for testing
    const admin = new User({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 1, // Role 1 = Admin
    });
    adminUser = await admin.save();
    // Simulate admin sign-in to get token
    const res = await request(app)
      .post('/api/user/signin')
      .send({
        email: 'admin@gmail.com',
        password: 'admin123',
      });

    userToken = res.body.token;
    adminId = res.body.user._id;
  });



  it("should create a product as an admin", async () => {
    const testImagePath = path.join(__dirname, "assets", "testImage.png");
    // Mock the product data


    const productData = {
      name: "Test Product",
      description: "A test product",
      stock: 10,
      price: 100,
      category: "TestCategory",
    };
    console.log("File exists:", testImagePath);
    const res = await request(app)
      .post("/api/product/create")
      .set("Authorization", `Bearer ${userToken}`)
      .field("name", productData.name)
      .field("description", productData.description)
      .field("stock", productData.stock)
      .field("price", productData.price)
      .field("category", productData.category)
      .attach("photo", testImagePath, {
        filename: "testImage.png",
        contentType: "image/png"
      });

    console.log("File exists:", fs.existsSync(testImagePath));


    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Product created successfully!");
    expect(res.body.product).toMatchObject({
      name: productData.name,
      description: productData.description,
      stock: productData.stock,
      price: productData.price,
    });
  });


  it('should delete a product as an admin', async () => {
    // Create a product to delete
    const product = await Product.create({
      name: "Test Product",
      description: "Test Description",
      category: "63bff53788e77963ac2e3b4f",
      price: 100,
      stock: 10,
    });

    console.log("product._id",product._id,"adminId",adminId)
    const res = await request(app)
      .delete(`/api/product/delete/${product._id}/${adminId}`)
      .set("Authorization", `Bearer ${userToken}`); // Replace with a valid admin token

    // Check the response
    expect(res.status).toBe(200); // Assuming 200 is returned on successful deletion
    expect(res.body).toHaveProperty("message", "Deletion was a success"); // Example response property


  });


  it('should update a product as an admin', async () => {
    const product = await Product.create({
      name: "Test Product",
      description: "Test Description",
      category: "63bff53788e77963ac2e3b4f",
      price: 100,
      stock: 10,
    });
    const res = await request(app)
      .put(`/api/product/update/${product._id}`)
      .set("Authorization", `Bearer ${userToken}`); // Replace with a valid admin token

    // Check the response
    expect(res.status).toBe(200); // Assuming 200 is returned on successful update
    expect(res.body).toHaveProperty("message", "Product updated successfully!"); // Example response property

  })
  afterAll(async () => {
    await Product.deleteMany({});
    await User.deleteMany({});
    // Cleanup test database and close connection
    await mongoose.connection.close();
  });
});
