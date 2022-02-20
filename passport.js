const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");

FACEBOOK_APP_ID = "2758258381141825";
FACEBOOK_APP_SECRET = "da0712944a81cb2a8982e4f8fae3cad6";

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/fb-router/facebook/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      cb(null, profile);
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});
