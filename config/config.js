// // create  dataBase Connections and Export
// require("dotenv").config(".env");
// // use dev.env if enviroment is developemnt else use prod.env

// const dotenv = require("dotenv");

// if (process.env.NODE_ENV === "development") {
//   dotenv.config({ path: "dev.env" });
// } else {
//   dotenv.config({ path: "prod.env" });
// }

module.exports = {
  db_url: process.env.DB_URL,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expireIn: process.env.JWT_EXPIRATION,
  jwt_issuer: process.env.JWT_ISSUER,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  google_callback_url: process.env.GOOGLE_CALLBACK_URL,
  github_client_id: process.env.GITHUB_CLIENT_ID,
  github_client_secret: process.env.GITHUB_CLIENT_SECRET,
  github_callback_url: process.env.GITHUB_CALLBACK_URL,
};
