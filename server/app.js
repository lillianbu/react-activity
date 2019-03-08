const express = require("express");
const session = require('express-session');
const path = require("path");
// const http = require("http");

const passport = require('./passport');
const api = require('./routes/api');

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const publicPath = path.resolve(__dirname, "..", "client", "dist");

app.use(session({
  secret: 'session-secret',
  resave: 'false',
  saveUninitialized: 'true'
}));

app.use(express.static(publicPath));

app.use(passport.initialize());
app.use(passport.session());

console.log("auth firebase appjs")
app.get('/auth/firebase',
  passport.authenticate('firebaseauth', { }));

app.get('/auth/firebase/callback', 
  passport.authenticate('firebaseauth', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  });

app.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy(function (err) {
      req.user = null;
      res.redirect('/'); 
  });
});

http.listen(3000, () => {
  console.log(`Listening on port 3000 and looking in folder ${publicPath}`);
});





