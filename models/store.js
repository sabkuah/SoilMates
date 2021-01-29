const mongoose = require("mongoose");
const Plant = require("./plant");
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  name: String,
  city: String,
  email: String,
  description: String,
  plants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Plant",
    },
  ],
});

storeSchema.post("findOneAndDelete", async function (store) {
  if (store.plants.length) {
    const res = Plant.deleteMany({ _id: { $in: store.plants } });
    console.log(res);
  }
});

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;
