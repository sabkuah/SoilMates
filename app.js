const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsmate = require("ejs-mate");
const Plant = require("./models/plant");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

//========================
//   CONNECT DATABASE
//========================
mongoose.connect("mongodb://localhost:27017/soil-mates", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
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

const formSelects = {
  plantTypes: ["", "plant", "tree", "succulent"],
  waterNeeds: ["", "very little", "regular", "frequent"],
  lightNeeds: ["", "little", "some", "lots"],
};

// Home Page
app.get("/", (req, res) => {
  res.render("home");
});

//  Get All
app.get("/plants", async (req, res) => {
  const plants = await Plant.find({});
  res.render("plants/index", { plants });
});

//  Create New Plant
app.get("/plants/new", (req, res) => {
  res.render("plants/new", { formSelects });
});

app.post("/plants/new", async (req, res) => {
  const newPlant = new Plant(req.body);
  await newPlant.save();
  console.log("New Plant added>>", newPlant);
  res.redirect("/plants");
});

//Show Plant Details
app.get("/plants/:id", async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  res.render("plants/show", { plant });
});

//  Edit Plant
app.get("/plants/:id/edit", async (req, res) => {
  const plant = await Plant.findById(req.params.id);
  res.render("plants/edit", { plant, formSelects });
});

app.put("/plants/:id", async (req, res) => {
  const { id } = req.params;
  const plant = await Plant.findByIdAndUpdate(id, { ...req.body });
  console.log("Plant updated>>", plant);
  res.redirect(`/plants/${plant._id}`);
});

//  Delete Plant

app.listen(5000, () => {
  console.log("App running on Port 5000...");
});
