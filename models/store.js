const mongoose = require("mongoose");
const Plant = require("./plant");
const Review = require("./review");
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  name: String,
  city: String,
  email: String,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  plants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Plant",
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

storeSchema.post("findOneAndDelete", async function (store) {
  if (store.plants.length) {
    const res = await Plant.deleteMany({ _id: { $in: store.plants } });
    console.log(res);
  }

  if (store.reviews.length) {
    const res = await Review.deleteMany({ _id: { $in: store.reviews } });
    console.log(res);
  }
});

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;
