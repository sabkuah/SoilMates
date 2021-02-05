const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateStore, isLoggedIn, isShopAuthor } = require("../middlewares");
const catchAsync = require("../utils/catchAsync");
const stores = require("../controllers/stores");

//========================
//     STORE ROUTES
//========================

router.get("/", catchAsync(stores.index));

//Show store, Edit Store, Delete Store
router
  .route("/:storeId")
  .get(catchAsync(stores.showStore))
  .put(isLoggedIn, isShopAuthor, validateStore, catchAsync(stores.editStore))
  .delete(isLoggedIn, isShopAuthor, catchAsync(stores.deleteStore));

//New Store
router
  .route("/new")
  .get(isLoggedIn, stores.renderNewForm)
  .post(isLoggedIn, validateStore, catchAsync(stores.createStore));

//Edit Store form
router.get(
  "/:storeId/edit",
  isLoggedIn,
  isShopAuthor,
  catchAsync(stores.renderEditForm)
);

module.exports = router;
