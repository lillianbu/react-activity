const passport = require('passport');
const FirebaseStrategy = require('passport-firebase-auth').Strategy;

passport.use(new FirebaseStrategy({
    firebaseProjectId: "activity2019-f8035",
    authorizationURL: "activity2019-f8035.firebaseapp.com",
    callbackURL: '/auth/firebase/callback'
  },
  function(accessToken, refreshToken, decodedToken, cb) {
  	return cb(null, decodedToken);
    // User.findOrCreate({
    // 	'googleid': decodedToken.uid
    // }, function (err, user) {
    //   return cb(err, user);
    // });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

module.exports = passport;