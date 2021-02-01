const { plantSchema, storeSchema, reviewSchema } = require("./models/schemas");
const ExpressError = require("./utils/ExpressError");

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
