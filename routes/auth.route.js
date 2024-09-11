const express = require("express");
const passport = require("passport");
const authRoute = express.Router();

const {
  getUser,
  getUsers,
  login,
  signup,
  forgotPassword,
  resetPassword,
  handleOAuthCallback,
  OauthFailure,
} = require("./../controller/auth.controller");

// Middleware
const { verifyToken } = require("./../middleware/auth.middleware");
const OauthHandler = require("./../middleware/oauth.middleware");
//

//Google OAuth Routes
authRoute.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
// Google OAuth callback route
authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failure",
  }),
  OauthHandler,
  handleOAuthCallback
);

// Github OAuth Routes
authRoute.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

// Github OAuth callback route
authRoute.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/auth/failure",
  }),
  OauthHandler,
  handleOAuthCallback
);

authRoute.get("/auth/failure", OauthFailure);
// You Can Add More Routes Here
authRoute.get("/", verifyToken, getUsers);
authRoute.get("/me", verifyToken, getUser);
authRoute.post("/signup", signup);
authRoute.post("/login", login);
authRoute.post("/forgotPassword", forgotPassword);
authRoute.post("/resetPassword/:token", resetPassword);

module.exports = authRoute;
