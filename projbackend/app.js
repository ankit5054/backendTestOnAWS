require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// My Routes
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");
const categoryRoutes = require("./routes/category.js");
const productRoutes = require("./routes/product.js");
const orderRoutes = require("./routes/order.js");

const app = express();

// DB Connection
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://tusharwork:BUn!r3gMbP@QsX#@!@cluster0.lvn1o.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//
// mongoose
// .connect(process.env.DATABASE , {

mongoose
  .connect("mongodb+srv://tusharwork:Dcba123@cluster0.lvn1o.mongodb.net/?retryWrites=true&w=majority" , {
  // .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log(err);
    console.log("ALERT !!! \nFAILED TO CONNECT TO THE DB");
  });

//  MIddlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// PORT
const port = process.env.PORT || 8000;

// My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

// Starting Server
app.listen(port, () => {
  console.log(`WE ARE ONLINE!! Visit : http://localhost:${port}`);
});
