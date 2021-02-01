const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ReviewSchema = new Schema({
  body: String,
  selection: Number,
  service: Number,

  // author: {
  //     type: Schema.Types.ObjectId,
  //     ref: "User"
  // }
});

module.exports = mongoose.model("Review", ReviewSchema);
