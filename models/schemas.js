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

module.exports.storeSchema = Joi.object({
  name: Joi.string().lowercase().required(),
  city: Joi.string().lowercase().required(),
  email: Joi.string().email().required(),
  description: Joi.string(),
});
