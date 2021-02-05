const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middlewares");
const reviews = require("../controllers/reviews");

//========================
//     REVIEW ROUTES
//========================

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.addReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
