const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");

//============================
//    AUTHENTICATION ROUTES
//============================

//=== Register ===//

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.registerUser));

//=== Login ===//

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/users/login",
    }),
    users.loginUser
  );

//=== Logout ===//

router.get("/logout", users.logoutUser);

module.exports = router;
