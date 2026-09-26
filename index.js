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

// Start the server
const port = config.app.port;

// Load environment variables based on the environment
const db_uri = process.env.NODE_ENV === 'test' ? config.database.uri_test : config.database.uri_dev;

mongoose.set("useFindAndModify", false);

// Connect to MongoDB
// Connect DB (separate function)
const connectDB = async () => {
  try {
    await mongoose.connect(db_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
    console.log(`Connected to DB (${process.env.NODE_ENV})`);
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};
// Middleware
app.use(cookieParser());

app.use(cors());
app.use(bodyParser.json()); // ✅ Parses JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // ✅ Parses URL-encoded bodies

// API Routes
app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", cateRoute);
app.use("/api", productRoute);
app.use("/api", paymentRoute);
app.use("/api", orderRoute);
app.use("/api", reviewRoute);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handling for uncaught routes or exceptions
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).json({ error: "An unexpected error occurred" });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});

let server;

// Start the server if NODE_ENV=development
if (process.env.NODE_ENV !== "test") {
    connectDB().then(()=>{
      server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
    })

}


module.exports = { app, connectDB };