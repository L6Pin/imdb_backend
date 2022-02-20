const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const {User}  = require("./models/user");

require("dotenv").config();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "link", "photos", "email"],
      state: true,
    },
    function (accessToken, refreshToken, profile, cb) {
      const { email } = profile._json;
      User.findOne({ email }, (err, acc) => {
        if (!acc) {
          user = new User({
            email: email,
            password: "",
            registerSource: "Facebook",
          }).save();
        } 
      });
      return cb(null, profile);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
