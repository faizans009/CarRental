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
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
app.use("/uploads/", express.static("uploads")); 
app.use(cookieParser());
// Database
dbConnection().catch((err) => console.log(err));
async function dbConnection() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
  console.log("Database Connected");
} 
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Database Connection has been established successfully");
});
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const customCss = fs.readFileSync((__dirname + "/swagger.css"), 'utf8');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customCss }));

app.use('/auth', userRouter.router);
app.use('/car', carRouter.router);
app.use('/category', categoryRouter.router);
app.use('/review', reviewRouter.router);
app.use('/profile', profileRouter.router);
app.use('/contact', contactUsRouter.router); 
app.use('/fav', favouriteRouter.router);
app.use('/order', orderRouter.router);
// app.get('/',(req,res)=>{
//   res.send('test')
// })
app.listen(process.env.PORT, () =>

  console.log(`Hello world app listening on port ${process.env.PORT}!`)
);
 