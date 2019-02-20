const express = require("express");
const path = require("path");

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const publicPath = path.resolve(__dirname, "..", "client", "dist");


app.use(express.static(publicPath));

// app.get(
//   '/auth/google/callback',
//   passport.authenticate(
//     'google',
//     { failureRedirect: '/' }
//   ),
//   function(req, res) {

//     res.redirect('/game');
//     });

// auth.onAuthStateChanged(user => {
//   if(user) {
//     window.location = 'home.html'; //After successful login, user will be redirected to home.html
//   }
// });


http.listen(3000, () => {
  console.log(`Listening on port 3000 and looking in folder ${publicPath}`);
});





