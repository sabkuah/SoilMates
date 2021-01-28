const Joi = require("joi");

module.exports.plantSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().uri().required(),
  type: Joi.string().required(),
  water: Joi.string().required(),
  light: Joi.string().required(),
  isPetFriendly: Joi.boolean(),
  description: Joi.string().required(),
});
