const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsmate = require("ejs-mate");
const Plant = require("./models/plant");
const Store = require("./models/store");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { plantSchema } = require("./models/schemas");

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

const validatePlant = (req, res, next) => {
  console.log(req.body);
  const { error } = plantSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateStore = (req, res, next) => {
  console.log(req.body);
  const { error } = storeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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

//========================
//     PLANT ROUTES
//========================

//  Get All
app.get(
  "/plants",
  catchAsync(async (req, res) => {
    const plants = await Plant.find({});
    res.render("plants/index", { plants });
  })
);

//  Create New Plant
app.get("/plants/new", (req, res) => {
  res.render("plants/new", { formSelects });
});

app.post(
  "/plants/new",
  validatePlant,
  catchAsync(async (req, res, next) => {
    const newPlant = new Plant(req.body);
    //console.log("new plant>>>>>>", newPlant);
    await newPlant.save();
    console.log("New Plant added>>", newPlant);
    res.redirect("/plants");
  })
);

//Show Plant Details
app.get(
  "/plants/:id",
  catchAsync(async (req, res) => {
    const plant = await Plant.findById(req.params.id);
    res.render("plants/show", { plant });
  })
);

//  Edit Plant
app.get(
  "/plants/:id/edit",
  catchAsync(async (req, res) => {
    const plant = await Plant.findById(req.params.id);
    res.render("plants/edit", { plant, formSelects });
  })
);

app.put(
  "/plants/:id",
  validatePlant,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const plant = await Plant.findByIdAndUpdate(id, { ...req.body });
    console.log("Plant updated>>", plant);
    res.redirect(`/plants/${plant._id}`);
  })
);

//  Delete Plant
app.delete(
  "/plants/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const plant = await Plant.findByIdAndDelete(id);
    console.log("Plant deleted>>", plant);
    res.redirect("/plants");
  })
);

//========================
//     STORE ROUTES
//========================

//  Get All
app.get(
  "/stores",
  catchAsync(async (req, res) => {
    const stores = await Store.find({});
    res.render("stores/index", { stores });
  })
);

//  Create New Store
app.get("/stores/new", (req, res) => {
  res.render("stores/new");
});

app.post(
  "/stores/new",
  validateStore,
  catchAsync(async (req, res, next) => {
    const newStore = new Store(req.body);
    //await newStore.save();
    console.log("New Store added>>", newStore);
    res.redirect("/stores");
  })
);

app.listen(5000, () => {
  console.log("App running on Port 5000...");
});

//Show Store Details
app.get(
  "/stores/:id",
  catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id);
    res.render("stores/show", { store });
  })
);

//  Edit Store
app.get(
  "/stores/:id/edit",
  catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id);
    res.render("stores/edit", { store });
  })
);

app.put(
  "/stores/:id",
  validatePlant,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const store = await Store.findByIdAndUpdate(id, { ...req.body });
    console.log("Store updated>>", store);
    res.redirect(`/stores/${store._id}`);
  })
);

//  Delete Plant
app.delete(
  "/stores/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const store = await Store.findByIdAndDelete(id);
    console.log("Store deleted>>", store);
    res.redirect("/stores");
  })
);
