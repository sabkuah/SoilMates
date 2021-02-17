const Plant = require("../models/plant");
const Store = require("../models/store");

const formSelects = {
  plantTypes: ["", "plant", "tree", "succulent"],
  waterNeeds: ["", "very little", "regular", "frequent"],
  lightNeeds: ["", "little", "some", "lots"],
};

//========================
// Add A Plant to a Store
//========================

module.exports.renderNewForm = async (req, res) => {
  const store = await Store.findById(req.params.storeId);
  res.render("plants/new", { formSelects, store });
};

module.exports.createNewPlant = async (req, res) => {
  const { storeId } = req.params;
  const store = await Store.findById(storeId);
  const newPlant = new Plant(req.body);
  newPlant.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  store.plants.push(newPlant);
  newPlant.store = store;
  await newPlant.save();
  await store.save();
  console.log("New Plant added>>>", newPlant);
  console.log("Store Updated>>>", store);
  req.flash("success", "Plant added!");
  res.redirect(`/stores/${store._id}`);
};

//========================
//     Show Plant
//========================

module.exports.getPlants = async (req, res) => {
  const plant = await Plant.findById(req.params.plantId).populate("store");
  res.render("plants/show", { plant });
};

//========================
//     Edit Plant
//========================

module.exports.renderEditForm = async (req, res) => {
  const plant = await Plant.findById(req.params.plantId);
  res.render("plants/edit", { plant, formSelects });
};

module.exports.editPlant = async (req, res, next) => {
  const { plantId, storeId } = req.params;
  const plant = await Plant.findByIdAndUpdate(plantId, { ...req.body });
  console.log("Plant updated>>", plant);
  req.flash("success", "Plant updated!");
  res.redirect(`/stores/${storeId}/plants/${plant._id}`);
};

//========================
//     Delete Plant
//========================

module.exports.deletePlant = async (req, res) => {
  const { storeId, plantId } = req.params;
  await Store.findByIdAndUpdate(storeId, { $pull: { plants: plantId } });
  const plant = await Plant.findByIdAndDelete(plantId);
  console.log("Plant deleted>>", plant);
  req.flash("success", "Plant deleted!");
  res.redirect(`/stores/${storeId}`);
};
