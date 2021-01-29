const mongoose = require("mongoose");
const Plant = require("./plant");
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  name: String,
  city: String,
  email: String,
  description: String,
  image: String,
  plants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Plant",
    },
  ],
});

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;
