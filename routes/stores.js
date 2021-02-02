const express = require("express");
const router = express.Router();
const Store = require("../models/store");
const { validateStore, isLoggedIn, isShopAuthor } = require("../middlewares");
const catchAsync = require("../utils/catchAsync");

//========================
//     STORE ROUTES
//========================

//========================
//       GET ALL
//========================
router.get(
  "/",
  catchAsync(async (req, res) => {
    const stores = await Store.find({});
    res.render("stores/index", { stores });
  })
);

//========================
//       NEW STORE
//========================
router.get("/new", isLoggedIn, (req, res) => {
  res.render("stores/new");
});

router.post(
  "/new",
  isLoggedIn,
  validateStore,
  catchAsync(async (req, res, next) => {
    const newStore = new Store(req.body);
    newStore.author = req.user._id;
    await newStore.save();
    console.log("New Store added>>", newStore);
    req.flash("success", "Store added!");
    res.redirect("/stores");
  })
);

//========================
//      SHOW STORE
//========================
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id)
      .populate("author")
      .populate("plants")
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      });
    res.render("stores/show", { store });
  })
);

//========================
//      EDIT STORE
//========================
router.get(
  "/:id/edit",
  isLoggedIn,
  isShopAuthor,
  catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.id);
    res.render("stores/edit", { store });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isShopAuthor,
  validateStore,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const store = await Store.findByIdAndUpdate(id, { ...req.body });
    console.log("Store updated>>", store);
    req.flash("success", "Store updated!");
    res.redirect(`/stores/${store._id}`);
  })
);

//========================
//     DELETE STORE
//========================
router.delete(
  "/:storeId",
  isLoggedIn,
  isShopAuthor,
  catchAsync(async (req, res) => {
    const { storeId } = req.params;
    const store = await Store.findByIdAndDelete(storeId);
    console.log("Store deleted>>", store);
    req.flash("success", "Store deleted!");
    res.redirect("/stores");
  })
);

module.exports = router;
