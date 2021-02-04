const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validatePlant, isLoggedIn, isShopAuthor } = require("../middlewares");
const Plant = require("../models/plant");
const Store = require("../models/store");

const formSelects = {
  plantTypes: ["", "plant", "tree", "succulent"],
  waterNeeds: ["", "very little", "regular", "frequent"],
  lightNeeds: ["", "little", "some", "lots"],
};

//app.use("/stores/:storeId/plants", plantRoutes);

//========================
// Add A Plant to a Store
//========================

router.get(
  "/new",
  isLoggedIn,
  isShopAuthor,
  catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.storeId);
    res.render("plants/new", { formSelects, store });
  })
);

router.post(
  "/new",
  isLoggedIn,
  isShopAuthor,
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
    req.flash("success", "Plant added!");
    res.redirect(`/stores/${store._id}`);
  })
);

//========================
//     Show Plant
//========================
router.get(
  "/:plantId",
  catchAsync(async (req, res) => {
    const plant = await Plant.findById(req.params.plantId).populate("store");
    res.render("plants/show", { plant });
  })
);

//========================
//     Edit Plant
//========================
router.get(
  "/:plantId/edit",
  isLoggedIn,
  isShopAuthor,
  catchAsync(async (req, res) => {
    const plant = await Plant.findById(req.params.plantId);
    res.render("plants/edit", { plant, formSelects });
  })
);

router.put(
  "/:plantId",
  isLoggedIn,
  isShopAuthor,
  validatePlant,
  catchAsync(async (req, res, next) => {
    const { plantId, storeId } = req.params;
    const plant = await Plant.findByIdAndUpdate(plantId, { ...req.body });
    console.log("Plant updated>>", plant);
    req.flash("success", "Plant updated!");
    res.redirect(`/stores/${storeId}/plants/${plant._id}`);
  })
);

//========================
//     Delete Plant
//========================
http: router.delete(
  "/:plantId",
  isLoggedIn,
  isShopAuthor,
  catchAsync(async (req, res) => {
    const { storeId, plantId } = req.params;
    await Store.findByIdAndUpdate(storeId, { $pull: { plants: plantId } });
    const plant = await Plant.findByIdAndDelete(plantId);
    console.log("Plant deleted>>", plant);
    req.flash("success", "Plant deleted!");
    res.redirect(`/stores/${storeId}`);
  })
);

module.exports = router;
