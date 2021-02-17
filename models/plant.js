const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  this.url.replace("/upload", "/upload/w_200");
});

const PlantSchema = new Schema({
  name: {
    type: String,
  },
  images: [ImageSchema],
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
  store: {
    type: Schema.Types.ObjectId,
    ref: "Store",
  },
});

const Plant = mongoose.model("Plant", PlantSchema);
module.exports = Plant;
