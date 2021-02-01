const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsmate = require("ejs-mate");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const dotEnv = require("dotenv");

const plantRoutes = require("./routes/plants");
const storeRoutes = require("./routes/stores");

//========================
//   CONNECT DATABASE
//========================

dotEnv.config();
const dbUrl = process.env.DB_URL;

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

//========================
//       ROUTES
//========================

app.use("/", plantRoutes);
app.use("/stores", storeRoutes);

// Home Page
app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  res.send("404!!!");
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
