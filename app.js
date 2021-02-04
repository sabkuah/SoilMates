const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsmate = require("ejs-mate");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const dotEnv = require("dotenv");
const session = require("express-session");
const flash = require("connect-flash");
const Plant = require("./models/plant");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const plantRoutes = require("./routes/plants");
const storeRoutes = require("./routes/stores");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const { required } = require("joi");

//========================
//   CONNECT DATABASE
//========================

dotEnv.config();
//const dbUrl = process.env.DB_URL;
const dbUrl = "mongodb://localhost:27017/soil-mates";

mongoose.connect(dbUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

//========================
//      MIDDLEWARE
//========================
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate); //for partials
app.use(express.static(path.join(__dirname, "public"))); //for stylesheets
app.use(express.urlencoded({ extended: true })); //for req body
app.use(methodOverride("_method")); //for form PUT, DEL requests
app.use(flash());

//=== Session and Cookies ===//
const sessionConfig = {
  secret: "tempsecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //one week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

//=== Authentication ===//
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=== Flash ===//
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//========================
//       ROUTES
//========================

app.use("/users", userRoutes);
app.use("/stores", storeRoutes);
app.use("/stores/:storeId/plants", plantRoutes);
app.use("/stores/:storeId/reviews", reviewRoutes);

// Home Page
app.get("/", (req, res) => {
  res.render("home");
});

// Plant Index Page
app.get(
  "/plants",
  catchAsync(async (req, res) => {
    const plants = await Plant.find({});
    res.render("plants/index", { plants });
  })
);

app.all("*", (req, res, next) => {
  res.render("notFound");
});

//===========================
//     ERROR HANDLING
//===========================

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, something went wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("App running on Port: ", port);
});
