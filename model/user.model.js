const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, "Minimum Length Should be 3"],
    maxlength: [20, "Maximum Length Should be 20"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "Invalid Email Address"],
  },

  //google auth implementation
  googleId: String,
  githubId: String,

  // date of registration
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // date of last update
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  password: {
    type: String,
    select: false,
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const User = mongoose.model("user", userSchema);
module.exports = User;
