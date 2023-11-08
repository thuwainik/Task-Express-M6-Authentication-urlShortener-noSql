const express = require("express");
const connectDb = require("./database");
const urlRoutes = require("./api/urls/urls.routes");
const userRoutes = require("./api/users/users.routes");
const notFoundHandler = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middlewares/passport");
require("dotenv").config;

const app = express();
connectDb();

app.use(express.json());

app.use(passport.initialize());
passport.use("local", localStrategy);
passport.use("jwt", jwtStrategy);

app.use("/urls", urlRoutes);
app.use("/api", userRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("The application is running on localhost:8000");
});
