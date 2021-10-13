require("dotenv").config();
const authRoute = require("./routes/auth");
const cors = require("cors");
const userRoute = require("./routes/user");
const cateRoute = require("./routes/category");
const orderRoute = require("./routes/order");
const path = require("path");
const productRoute = require("./routes/product");
const paymentRoute = require("./routes/paymentBRoutes");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
mongoose
  .connect("mongodb://localhost:27017/ecom", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((data) => {
    console.log("DB succeed");
  })
  .catch((error) => {
    console.log("DB stopped working", error);
  });
app.use(bodyParser.json()); 
app.use(cookieParser());
app.use(cors());
app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", cateRoute);
app.use("/api", productRoute);
app.use("/api", paymentRoute);
app.use("/api", orderRoute);

// ... other app.use middleware
app.use(express.static(path.join(__dirname, "client", "build")));

const port = process.env.PORT;
app.get("/", (req, res) => res.send("hello there"));

// Right before your app.listen(), add this:
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`${port}`);
});
