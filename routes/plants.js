const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { validatePlant } = require("../middlewares");
const Plant = require("../models/plant");
const Store = require("../models/store");

const formSelects = {
  plantTypes: ["", "plant", "tree", "succulent"],
  waterNeeds: ["", "very little", "regular", "frequent"],
  lightNeeds: ["", "little", "some", "lots"],
};

//========================
//     Get All
//========================

router.get(
  "/plants",
  catchAsync(async (req, res) => {
    const plants = await Plant.find({});
    res.render("plants/index", { plants });
  })
);

//========================
// Add A Plant to a Store
//========================

router.get(
  "/stores/:storeId/plants/new",
  catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.storeId);
    res.render("plants/new", { formSelects, store });
  })
);

router.post(
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
    req.flash("success", "Plant added!");
    res.redirect(`/stores/${store._id}`);
  })
);

//========================
//     Show Plant
//========================
router.get(
  "/plants/:id",
  catchAsync(async (req, res) => {
    const plant = await Plant.findById(req.params.id).populate("store");
    res.render("plants/show", { plant });
  })
);

//========================
//     Edit Plant
//========================
router.get(
  "/plants/:id/edit",
  catchAsync(async (req, res) => {
    const plant = await Plant.findById(req.params.id);
    res.render("plants/edit", { plant, formSelects });
  })
);

router.put(
  "/plants/:id",
  validatePlant,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const plant = await Plant.findByIdAndUpdate(id, { ...req.body });
    console.log("Plant updated>>", plant);
    req.flash("success", "Plant updated!");
    res.redirect(`/plants/${plant._id}`);
  })
);

//========================
//     Delete Plant
//========================
router.delete(
  "/stores/:storeId/plants/:plantId",
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
