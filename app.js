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
const { plantSchema, storeSchema } = require("./models/schemas");
const dotEnv = require("dotenv");

//========================
//   CONNECT DATABASE
//========================

dotEnv.config();

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/soil-mates";
mongoose.connect(dbUrl, {
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
// app.get("/plants/new", (req, res) => {
//   res.render("plants/new", { formSelects });
// });

//Add A Plant to a Store
app.get(
  "/stores/:storeId/plants/new",
  catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.storeId);
    res.render("plants/new", { formSelects, store });
  })
);

app.post(
  "/stores/:storeId/plants/new",
  validatePlant,
  catchAsync(async (req, res) => {
    const { storeId } = req.params;
    const store = await Store.findById(storeId);
    const newPlant = new Plant(req.body);
    store.plants.push(newPlant);
    newPlant.store = store;
    await newPlant.save();
    await store.save();
    console.log("New Plant added>>>", newPlant);
    console.log("Store Updated>>>", store);
    res.redirect(`/stores/${store._id}`);
  })
);

//Show Plant Details
app.get(
  "/plants/:id",
  catchAsync(async (req, res) => {
    const plant = await Plant.findById(req.params.id).populate("store");
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
  "/stores/:storeId/plants/:plantId",
  catchAsync(async (req, res) => {
    const { storeId, plantId } = req.params;
    await Store.findByIdAndUpdate(storeId, { $pull: { plants: plantId } });
    const plant = await Plant.findByIdAndDelete(plantId);
    console.log("Plant deleted>>", plant);
    res.redirect(`/stores/${storeId}`);
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
    await newStore.save();
    console.log("New Store added>>", newStore);
    res.redirect("/stores");
  })
);

//Show Store Details
app.get(
  "/stores/:id",
  catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id).populate("plants");
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
  validateStore,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const store = await Store.findByIdAndUpdate(id, { ...req.body });
    console.log("Store updated>>", store);
    res.redirect(`/stores/${store._id}`);
  })
);

//  Delete Store
app.delete(
  "/stores/:storeId",
  catchAsync(async (req, res) => {
    const { storeId } = req.params;

    const store = await Store.findByIdAndDelete(storeId);
    console.log("Store deleted>>", store);
    res.redirect("/stores");
  })
);

//db.plant.update({},{ $pull: {store._id:"601387fb735d0321b738b05a"}},{})

app.all("*", (req, res, next) => {
  res.send("404!!!");
});

// //Errpr Handling middleware --> gets called in next() if code enters the catch block

// app.use((err, req, res, next) => {
//   const { statusCode = 500 } = err;
//   if (!err.message) err.message = "Oh no, something went wrong!";
//   res.status(statusCode).render("error", { err });
// });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("App running on Port: ", port);
});
