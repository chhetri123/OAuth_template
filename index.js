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
db.then(() => {
  console.log("Connected to the database");
});
app.listen(config.port || 8001, () => {
  console.log(`Server is running on port ${config.port}`);
});
