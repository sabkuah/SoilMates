const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Plant = require("./plant");
const Store = require("./store");

const inventorySchema = new Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
  },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plant",
    },
  ],
});

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
