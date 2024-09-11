const passport = require("passport");

const setupStrategy = (Strategy, config, callbackURL, oauthCallback) => {
  passport.use(
    new Strategy(
      {
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: callbackURL,
        scope: ["profile", "email"],
      },
      oauthCallback
    )
  ); // Reuse the oauthCallback function
};

module.exports = setupStrategy;
