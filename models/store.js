const mongoose = require("mongoose");
const Plant = require("./plant");
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  name: {
    type: String,
    required: [true, "Store must have a name!"],
  },
  city: {
    type: String,
    required: true,
  },
  image: String,
  description: String,
  plants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Plant",
    },
  ],
});

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;
