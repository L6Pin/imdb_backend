const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieSession = require("cookie-session");

const passwordResetRoutes = require("./api/routes/passwordReset.routes");
const authRoutes = require("./api/routes/auth.routes");
const moviesRoutes = require("./api/controllers/movies.controller");
const passport = require("passport");

const jwtMiddleware = require("./middleware/jwt-middleware");
const helper = require("./helper");
const { User } = require("./models/user");
const jwt = require("jsonwebtoken");

require("./auth");
require("dotenv").config();

const {
  registration,
  login,
  userVerification,
} = require("./api/controllers/auth.controller");

const environment = helper(process.env.isDev);

const app = express();
app.use(
  cookieSession({
    name: "session",
    keys: ["imdb_keep_safe"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("dotenv").config();

app.use(cors({ credentials: true, origin: "http://localhost:4200" }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.a9doj.mongodb.net/Users?retryWrites=true&w=majority`
);

app.get("/health", (req, res) => {
  res.send("Server working!");
});

app.get("/", (req, res) => {
  res.redirect("/health");
});

app.get("/dashboard", jwtMiddleware, (req, res) => {
  res.status(200).json({
    message: "Success!",
  });
});

app.use("/auth", authRoutes);
app.use("/password-reset", passwordResetRoutes);
app.use("/movies", moviesRoutes);

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at ${environment} `);
});

module.exports = app;
