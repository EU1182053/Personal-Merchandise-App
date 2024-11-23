require("dotenv").config();
const authRoute = require("./routes/auth");

const userRoute = require("./routes/user");
const cateRoute = require("./routes/category");
const orderRoute = require("./routes/order");
const productRoute = require("./routes/product");
const paymentRoute = require("./routes/paymentBRoutes");
const reviewRoute = require("./routes/review");

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false, 
  }) 
  .then((data) => {
    console.log("DB succeed");
  })
  .catch((error) => {
    console.log("DB stopped working",error );
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
app.use("/api", reviewRoute);

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
