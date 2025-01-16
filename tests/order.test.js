const request = require("supertest");
const { Order } = require("../models/order"); // Assuming order.js contains your Order model
const { Product } = require("../models/product");
const { User } = require("../models/user");
const server = require("../index");

describe("POST /order/create/:userId", () => {
  let token;
  let userId;
  let productId;
  let product;
  let orderPayload;

  beforeAll( async() => {
    await mongoose.connect(config.database.uri_test, { useNewUrlParser: true, useUnifiedTopology: true });

  })

  beforeEach(async () => {
    // Create a mock user
    const user = new User({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });
    await user.save();
    userId = user._id;

    // Generate a token (adjust the token generation based on your auth implementation)
    token = "Bearer " + user.generateAuthToken();

    // Create a mock product
    product = new Product({
      name: "Test Product",
      description: "A test product",
      price: 699,
      category: "6729bb01a6ac45092c18d2d1", // Replace with a valid category ID
      stock: 10,
    });
    await product.save();
    productId = product._id;

    // Order payload
    orderPayload = {
      order: {
        products: [
          {
            _id: productId,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: 1,
            price: product.price,
          },
        ],
        amount: 699,
        transaction_id: "p2o8nvjh7y",
      },
    };
  });

  afterEach(async () => {
    // Clean up database after each test
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
  });

  it("should create an order successfully", async () => {
    const res = await request(server)
      .post(`/api/order/create/${userId}`)
      .set("Authorization", token)
      .send(orderPayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.products).toHaveLength(1);
    expect(res.body.amount).toBe(699);
  });

  it("should fail if a product in the order is out of stock", async () => {
    // Reduce stock to zero
    await Product.findByIdAndUpdate(productId, { stock: 0 });

    const res = await request(server)
      .post(`/api/order/create/${userId}`)
      .set("Authorization", token)
      .send(orderPayload);

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Bulk operation failed/);
  });

  it("should fail if the user is not authenticated", async () => {
    const res = await request(server)
      .post(`/api/order/create/${userId}`)
      .send(orderPayload);

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/Authorization header missing/);
  });
});
