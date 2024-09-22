const express = require("express");
const app = express();
const passport = require("passport");
const config = require("./config/config");
require("./utils/password");
const db = require("./config/db.config");
//  Routes
const authRoute = require("./routes/auth.route");

// Global MiddleWare
app.use(express.json());

//Password Initalization Middleware
app.use(passport.initialize());

// Authentication Route Middleware
app.use("/api/auth", authRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// 404 Error Handling Middleware
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});
db.then(() => {
  console.log("Connected to the database");
});
app.listen(config.port || 8001, () => {
  console.log(`Server is running on port ${config.port}`);
});

module.exports = app;
