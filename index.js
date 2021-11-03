const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const fs = require("fs");

// configuration
dotenv.config();
const app = express();
// routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

//middlewares
const runServer = async () => {
  //> db
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
  mongoose.connection.on("error", (err) => {
    console.log(`DB connection error: ${err.message}`);
  });
  //<db

  app.use(morgan(`:method :url :status :response-time`));
  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);
  app.use(function (err, req, res, next) {
    if (err.name === "UnauthorizedError") {
      res.status(401).json({ error: "Будь ласка, увійдіть в свій аккаунт!" });
    }
  });

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Сервер запущений на порту: ${PORT}`);
  });
};
runServer();
