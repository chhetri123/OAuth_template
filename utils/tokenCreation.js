const jwt = require("jsonwebtoken");
const config = require("../config/config");

const tokenCreation = (data) => {
  return jwt.sign(data, config.jwt_secret, {
    expiresIn: config.jwt_expireIn,
    issuer: config.jwt_issuer,
  });
};

module.exports = tokenCreation;
