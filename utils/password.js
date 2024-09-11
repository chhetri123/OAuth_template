const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const User = require("../model/user.model");
const setupStrategy = require("./oauthStrategies");
const config = require("./../config/config");
// Collection of Strategis you want to add in your application
const strategys = {
  google: {
    Strategy: GoogleStrategy,
    clientID: config.google_client_id,
    clientSecret: config.google_client_secret,
    callbackURL: config.google_callback_url,
  },
  github: {
    Strategy: GithubStrategy,
    callbackURL: config.github_callback_url,
    clientID: config.github_client_id,
    clientSecret: config.github_client_secret,
  },

  // Add more Strategies as needed for your application
};

// CallBack function Handler
const oauthCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    console.log(profile);
    return done(null, { accessToken, profile });
  } catch (err) {
    console.error(err);
    return done(err, false);
  }
};

// Use the strategies for passport authentication
// Iterate through the strategies Object and pass them through Strategy Constructor
Object.keys(strategys).forEach((key) => {
  const { Strategy, callbackURL, clientID, clientSecret } = strategys[key];
  setupStrategy(
    Strategy,
    {
      clientID,
      clientSecret,
    },
    callbackURL,
    oauthCallback
  );

  passport.serializeUser((user, done) => {
    console.log("Hello From Serialize");
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log("Hello From deserialize");
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
});
