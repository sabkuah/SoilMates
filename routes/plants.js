const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validatePlant, isLoggedIn, isShopAuthor } = require("../middlewares");
const plants = require("../controllers/plants");

const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });

//========================
//     PLANT ROUTES
//========================

//=== New plant ===//

router
  .route("/new")
  .get(isLoggedIn, isShopAuthor, catchAsync(plants.renderNewForm))
  .post(
    isLoggedIn,
    isShopAuthor,
    upload.array("image"),
    validatePlant,
    catchAsync(plants.createNewPlant)
  );

//=== Show, Edit, Delete plant ===//

router
  .route("/:plantId")
  .get(catchAsync(plants.getPlants))
  .put(
    isLoggedIn,
    isShopAuthor,
    upload.array("image"),
    validatePlant,
    catchAsync(plants.editPlant)
  )
  .delete(isLoggedIn, isShopAuthor, catchAsync(plants.deletePlant));

//=== Edit form ===//

router.get(
  "/:plantId/edit",
  isLoggedIn,
  isShopAuthor,
  catchAsync(plants.renderEditForm)
);

module.exports = router;
