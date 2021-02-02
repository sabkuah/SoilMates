const { plantSchema, storeSchema, reviewSchema } = require("./models/schemas");
const ExpressError = require("./utils/ExpressError");
const Store = require("./models/store");
const Review = require("./models/review");
const catchAsync = require("./utils/catchAsync");

//========================
//     AUTHORIZATION
//========================

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnUrl = req.originalUrl;
    req.flash("error", "You must be signed in to view this page.");
    return res.redirect("/users/login");
  }
  next();
};

module.exports.isShopAuthor = catchAsync(async (req, res, next) => {
  const { storeId } = req.params;
  const store = await Store.findById(storeId);
  if (!store.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit this store.");
    return res.redirect(`/stores/${storeId}`);
  }
});

module.exports.isReviewAuthor = catchAsync(async (req, res, next) => {
  const { storeId, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit this review.");
    return res.redirect(`/stores/${storeId}`);
  }
  next();
});

//========================
//   SCHEMA VALIADATION
//========================

module.exports.validatePlant = (req, res, next) => {
  console.log(req.body);
  const { error } = plantSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateStore = (req, res, next) => {
  console.log(req.body);
  const { error } = storeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  console.log(req.body);
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
