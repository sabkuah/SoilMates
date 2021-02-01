const express = require("express");
const router = express.Router();
const User = require("../models/user");

//========================
//        LOGIN
//========================

router.get("/login", (req, res) => {
  res.render("users/login");
});

//========================
//       REGISTER
//========================

router.get("/register", (req, res) => {
  res.render("users/register");
});

//========================
//         LOGOUT
//========================

module.exports = router;
