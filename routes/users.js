const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

//========================
//       REGISTER
//========================

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log("New User Registered >>>", registeredUser);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Soil-Mates!");
        res.redirect("/plants");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

//========================
//        LOGIN
//========================

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/users/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back to Soil-Mates");
    const redirectUrl = "/plants";
    //delete req.session.returnUrl;
    res.redirect(redirectUrl);
  }
);

//========================
//         LOGOUT
//========================

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You have been logged out, see you next time!");
  res.redirect("/plants");
});

module.exports = router;
