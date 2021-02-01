const express = require("express");
const router = express.Router();
const Store = require("../models/store");
const { validateStore } = require("../middlewares");
const catchAsync = require("../utils/catchAsync");

//========================
//     STORE ROUTES
//========================

//  Get All
router.get(
  "/",
  catchAsync(async (req, res) => {
    const stores = await Store.find({});
    res.render("stores/index", { stores });
  })
);

//  Create New Store
router.get("/new", (req, res) => {
  res.render("stores/new");
});

router.post(
  "/new",
  validateStore,
  catchAsync(async (req, res, next) => {
    const newStore = new Store(req.body);
    await newStore.save();
    console.log("New Store added>>", newStore);
    res.redirect("/stores");
  })
);

//Show Store Details
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id).populate("plants");
    res.render("stores/show", { store });
  })
);

//  Edit Store
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id);
    res.render("stores/edit", { store });
  })
);

router.put(
  "/:id",
  validateStore,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const store = await Store.findByIdAndUpdate(id, { ...req.body });
    console.log("Store updated>>", store);
    res.redirect(`/stores/${store._id}`);
  })
);

//  Delete Store
router.delete(
  "/:storeId",
  catchAsync(async (req, res) => {
    const { storeId } = req.params;
    const store = await Store.findByIdAndDelete(storeId);
    console.log("Store deleted>>", store);
    res.redirect("/stores");
  })
);

module.exports = router;
