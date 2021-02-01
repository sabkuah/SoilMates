const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const Store = require("../models/store");
const catchAsync = require("../utils/catchAsync");

//========================
//     REVIEW ROUTES
//========================

//========================
//      Add Review
//Add reviews to a store
//validateReview
//add reference to store
//========================

router.post(
  "/",
  catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.storeId);
    const review = new Review(req.body);
    store.reviews.push(review);
    console.log(store);
    await store.save();
    await review.save();
    req.flash("success", "Added a new review!");
    res.redirect(`/stores/${store._id}`);
  })
);

//========================
//       Delete
//Delete reviews on a store
//update store when review is deleted
//========================

module.exports = router;
