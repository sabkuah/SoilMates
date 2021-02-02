const { date } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const ReviewSchema = new Schema({
  body: String,
  selection: Number,
  service: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);
