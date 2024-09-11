const jwt = require("jsonwebtoken");
const User = require("./../model/user.model");
const config = require("../config/config");

const verifyToken = async (req, res, next) => {
  try {
    // Extract the token from Authorization header
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      const error = new Error("Token is not provided");
      error.statusCode = 401;
      throw error;
    }

    // decode the jwt token
    const decoded = jwt.verify(token, config.jwt_secret);

    // if token is expired, send an error response
    if (decoded.exp * 1000 < Date.now()) {
      const error = new Error("Token is expired");
      error.statusCode = 401;
      throw error;
    }
    // validate the userid exist or not in the Database
    const user = await User.findOne({
      _id: decoded.id,
    });

    if (!user) {
      const error = new Error("User not found with token");
      error.statusCode = 404;
      throw error;
    }

    req.user = user;
    next();
  } catch (e) {
    res
      .status(e.statusCode || 500)
      .json({ msg: e.message || "Internal Server Error " });
  }
};

module.exports = {
  verifyToken,
};
