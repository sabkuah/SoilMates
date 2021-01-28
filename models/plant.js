const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlantSchema = new Schema({
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  type: {
    type: String,
    lowercase: true,
    enum: ["plant", "tree", "succulent"],
  },
  water: {
    type: String,
    lowercase: true,
    enum: ["very little", "regular", "frequent"],
  },
  light: {
    type: String,
    lowercase: true,
    enum: ["little", "some", "lots"],
  },
  description: {
    type: String,
  },
  isPetFriendly: Boolean,
  stores: [
    {
      type: Schema.Types.ObjectId,
      ref: "Store",
    },
  ],
});

const Plant = mongoose.model("Plant", PlantSchema);
module.exports = Plant;
