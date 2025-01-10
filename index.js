// Load environment variables
require("dotenv").config();

// Import dependencies
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const config = require("./config");

// Import routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const cateRoute = require("./routes/category");
const orderRoute = require("./routes/order");
const productRoute = require("./routes/product");
const paymentRoute = require("./routes/paymentBRoutes");
const reviewRoute = require("./routes/review");

// Initialize Express app
const app = express();

// Validate environment variables
if (!config.database.uri || !config.app.port) {
  console.error("Missing required environment variables. Check your .env file.");
  process.exit(1); // Exit the application if critical configurations are missing
}

// Connect to MongoDB
mongoose
  .connect(config.database.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("✅ Database connection successful"))
  .catch((error) => {
    console.error("❌ Database connection error:", error);
    process.exit(1); // Exit the app if the database connection fails
  });

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// API Routes
app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", cateRoute);
app.use("/api", productRoute);
app.use("/api", paymentRoute);
app.use("/api", orderRoute);
app.use("/api", reviewRoute);

// Error handling for uncaught routes or exceptions
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).json({ error: "An unexpected error occurred" });
});

// Start the server
const port = config.app.port;

const server = app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

// Export the server instance
module.exports = server;  // export `server`, not just `app`