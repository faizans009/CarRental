// Importing package
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const app = express();
const userRouter = require("./routes/userRouter");
const carRouter = require("./routes/carRouter");
const categoryRouter = require("./routes/categoryRouter");
const reviewRouter = require("./routes/reviewRouter");
const profileRouter = require("./routes/profileRouter");
const contactUsRouter = require("./routes/contactUsRouter");
const favouriteRouter = require("./routes/favouriteRouter");
const orderRouter = require("./routes/orderRouter");
const uploadRouter = require("./routes/uploadsRouter.js");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express")
const  swaggerSpec =require("./swagger.js");

app.use(cors());
app.use(express.json());
app.use("/uploads/", express.static("uploads")); 
app.use(cookieParser());

// const swaggerAuth = (req, res, next) => {
//   const user = basicAuth(req);

//   const username = process.env.SWAGGER_USER || "admin";
//   const password = process.env.SWAGGER_PASSWORD || "password";

//   if (!user || user.name !== username || user.pass !== password) {
//     res.set("WWW-Authenticate", 'Basic realm="example"');
//     return res.status(401).send("Authentication required.");
//   }

//   next();
// };

app.use(
  "/api-docs",
  // swaggerAuth,
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec)
);
dbConnection().catch((err) => console.log(err));
async function dbConnection() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
  console.log("Database Connected");
} 
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Database Connection has been established successfully");
});

app.use('/auth', userRouter.router);
app.use('/car', carRouter.router);
app.use('/upload', uploadRouter.router);
app.use('/category', categoryRouter.router);
app.use('/review', reviewRouter.router);
app.use('/profile', profileRouter.router);
app.use('/contact', contactUsRouter.router); 
app.use('/fav', favouriteRouter.router);
app.use('/order', orderRouter.router);

app.listen(process.env.PORT, () =>

  console.log(`Hello world app listening on port ${process.env.PORT}!`)
);
 