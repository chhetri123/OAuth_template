const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const tokenCreation = require("./../utils/tokenCreation");

//
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      result: users.length,
      users,
    });
  } catch (err) {
    console.error(err);
    res
      .status(err.statusCode || 500)
      .json({ msg: err.message || "Internal Server Error " });
  }
};

const getUser = (req, res) => {
  res.status(200).json({
    msg: "Currently Logged in as ",
    user: req.user,
  });
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check wheather a user mail is exist or not
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // compare the entered password against the hashed password

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Incorrect Email or Password");
      error.statusCode = 401;
      throw error;
    }

    // generate a jwt and send the access token
    const accessToken = tokenCreation({ id: user._id });

    res.json({
      message: "Logged In Successfully",
      accessToken,
    });
  } catch (e) {
    console.error(e);
    res
      .status(e.statusCode || 500)
      .json({ msg: e.message || "Internal Server Error " });
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password, conformPassword } = req.body;

    // logic for conform password and password  comaprision
    if (password !== conformPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 400;
      throw error;
    }

    // check wheather a email is unique or not
    const isExistMail = await User.findOne({ email: email });
    if (isExistMail) {
      const error = new Error("Email already exists");
      error.statusCode = 400;
      throw error;
    }

    // we will hash the password uisng bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      username,
    });

    // we will create a jwt token and send that access token as a response

    res.json({
      message: "User created successfully. Please login",
    });
  } catch (e) {
    console.log(e);
    res
      .status(e.statusCode || 500)
      .json({ msg: e.message || "Internal Server Error " });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check email belongs to users or not

    const isUser = await User.findOne({ email: email });
    if (!isUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // create a token / ( create a new resetPassword url ) // crypto

    const resetToken = crypto.randomBytes(20).toString("hex");

    // hash the resetToken Password
    const hashToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Create a resetLink url
    const tokenExpiresIn = new Date() + 10 * 60 * 1000;

    // Save resetToken and tokenExpiresIn to the user document
    isUser.resetPasswordToken = hashToken;
    isUser.resetPasswordExpires = tokenExpiresIn;
    await isUser.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/resetPassword/${resetToken}`;
    // send back as response

    res.status(200).json({
      message: "Reset Password Link has been sent to your email",
      resetUrl,
    });
  } catch (e) {
    console.error(e);
    res
      .status(e.statusCode || 500)
      .json({ msg: e.message || "Internal Server Error " });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, conformPassword } = req.body;
    const { token } = req.params;
    // its req body password and conform password
    if (newPassword !== conformPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 400;
      throw error;
    }
    // Decode the params token
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");
    // checks its expiration date
    const user = await User.findOne({
      resetPasswordToken: hashToken,
    }).select("+password");

    // Check its Expiration Date
    if (!user || new Date(user.resetPasswordExpires) > new Date()) {
      const error = new Error("Token is expired or invalid");
      error.statusCode = 400;
      throw error;
    }
    // hash the password and update the password hash in database
    user.password = await bcrypt.hash(newPassword, 10);
    //  remove the  resetPasswordToken resetPasswordExpires from database
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    // sned the response and redirect to login
    res.status(200).json({
      msg: "Password updated successfully!! Please Login",
    });
  } catch (err) {
    console.error(err);
    res
      .status(err.statusCode || 500)
      .json({ msg: err.message || "Internal Server Error " });
  }
};

const handleOAuthCallback = async (req, res) => {
  try {
    // Successful OAuth authentication
    const user = req.user;
    const token = tokenCreation({ id: user._id });
    res.json({ message: "OAuth login successful", user, token });
  } catch (err) {
    console.error(err);
    res
      .status(err.statusCode || 500)
      .json({ msg: err.message || "Internal Server Error " });
  }
};
const OauthFailure = (req, res) => {
  res.status(401).json({ msg: "OAuth login failed" });
};
module.exports = {
  getUser,
  getUsers,
  login,
  signup,
  forgotPassword,
  resetPassword,
  handleOAuthCallback,
  OauthFailure,
};
