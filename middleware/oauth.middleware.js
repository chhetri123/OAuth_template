const User = require("./../model/user.model");

const OauthHandler = async (req, res, next) => {
  const { accessToken, profile } = req.user;
  try {
    switch (profile.provider) {
      case "google":
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
          });
        }
        req.user = user;
        return next();

      case "github":
        let email = null;
        if (profile.emails && profile.emails.length > 0) {
          email = profile.emails[0].value;
        } else {
          const emails = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${accessToken}`,
              "User-Agent": "OAuth App",
            },
          }).then((res) => res.json());
          const primaryEmail = emails.find((e) => e.primary) || emails[0];
          if (primaryEmail) {
            email = primaryEmail.email;
          }
        }
        // If no email, you might want to handle this case (e.g., prompt user to provide an email)
        if (!email) {
          console.log("No email found for the user");
          // Handle the case when email is null
        }
        let existingUser = await User.findOne({
          githubId: profile.id,
        });

        if (!existingUser) {
          existingUser = await User.create({
            githubId: profile.id,
            username: profile.displayName,
            email: email,
          });
        }
        req.user = existingUser;
        return next();
      default:
        throw new Error("Invalid OAuth provider");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to authenticate user" });
  }
};

module.exports = OauthHandler;
