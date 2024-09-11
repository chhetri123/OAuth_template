const config = require("./config.js");
const mongoose = require("mongoose");

const db = mongoose.connect(config.db_url);

module.exports = db;
