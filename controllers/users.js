const User = require("../models/user");

//========================
//       REGISTER
//========================

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.registerUser = async (req, res) => {
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
};

//========================
//        LOGIN
//========================

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome back to Soil-Mates");
  const redirectUrl = req.session.returnUrl || "/plants";
  delete req.session.returnUrl;
  res.redirect(redirectUrl);
};

//========================
//         LOGOUT
//========================

module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash("success", "You have been logged out, see you next time!");
  res.redirect("/plants");
};
