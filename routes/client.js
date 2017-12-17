var express = require('express');
var router = express.Router();
var user = require("../models/user");
var passport = require('passport');
var LocalStrategy = require('passport-local').LocalStrategy;
var auth = require('../authentication/auth');
var multer = require("./multerconfig");
var sell = require("../models/sell")


router.get('/', function (req, res, next) {
  if (req.user) {
    console.log(req.user)
    res.render("upload");
  }
  else {
    res.redirect("/client/login");
  }

});


router.post("/signup", (req, res) => {
  user.addUser(req).
    then((msg) => {
      req.login(msg, function (err) {
        if (!err) {
          console.log("It worked : " + req.user);
          res.redirect('/client');

        } else {
          console.log("Login in signup failed");
          console.log(msg);
          res.status(200);
          res.json(msg);
          res.redirect('/client/signup');
        }
      })

    })
    .catch((msg) => {
      req.flash("error", msg);
      console.log(msg);
      res.redirect("/client/signup");
    })
})


router.get("/signup", (req, res) => {
  res.render("signup")
})

router.get("/login", (req, res) => {
  res.render("login")
})

router.post("/login", passport.authenticate('local', { successRedirect: '/client/', failureRedirect: '/client/' }));




router.post("/upload", multer.upload.single("pres"), (req, res) => {
  sell.addItem(req, res)
    .then((msg) => {
      console.log("File Uploaded!!");
      req.flash("info",msg);
      res.redirect("/client");
    })
    .catch((err) => {
      console.log("File Not Uploaded!!");
      console.log(err)
      res.redirect("/client");
    })
})


router.get("/submit", (req, res) => {
  sell.toBeSubmitted(req, res)
    .then(function (data) {
      res.json(data)
    })
    .catch((err) => {
      console.log("error");
      res.redirect("/client");
    })
})


module.exports = router;
