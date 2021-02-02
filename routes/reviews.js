const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const Store = require("../models/store");
const catchAsync = require("../utils/catchAsync");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewares");

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
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const store = await Store.findById(req.params.storeId);
    const review = new Review(req.body);
    review.author = req.user._id;
    store.reviews.push(review);
    console.log(store);
    await store.save();
    await review.save();
    req.flash("success", "Added a new review!");
    res.redirect(`/stores/${store._id}/#reviews`);
  })
);

//========================
//       Delete
//Delete reviews on a store
//update store when review is deleted
//========================

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { storeId, reviewId } = req.params;
    await Store.findByIdAndUpdate(storeId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Deleted a review!");
    res.redirect(`/stores/${storeId}/#reviews`);
  })
);

module.exports = router;
