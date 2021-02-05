const Store = require("../models/store");

//========================
//       GET ALL
//========================
module.exports.index = async (req, res) => {
  const stores = await Store.find({});
  res.render("stores/index", { stores });
};

//========================
//       NEW STORE
//========================

module.exports.renderNewForm = (req, res) => {
  res.render("stores/new");
};

module.exports.createStore = async (req, res, next) => {
  const newStore = new Store(req.body);
  newStore.author = req.user._id;
  await newStore.save();
  console.log("New Store added>>", newStore);
  req.flash("success", "Store added!");
  res.redirect("/stores");
};

//========================
//      SHOW STORE
//========================

module.exports.showStore = async (req, res) => {
  const store = await Store.findById(req.params.storeId)
    .populate("author")
    .populate("plants")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    });
  res.render("stores/show", { store });
};

//========================
//      EDIT STORE
//========================

module.exports.renderEditForm = async (req, res) => {
  const store = await Store.findById(req.params.storeId);
  res.render("stores/edit", { store });
};

module.exports.editStore = async (req, res, next) => {
  const { storeId } = req.params;
  const store = await Store.findByIdAndUpdate(storeId, { ...req.body });
  console.log("Store updated>>", store);
  req.flash("success", "Store updated!");
  res.redirect(`/stores/${store._id}`);
};

//========================
//     DELETE STORE
//========================

module.exports.deleteStore = async (req, res) => {
  const { storeId } = req.params;
  const store = await Store.findByIdAndDelete(storeId);
  console.log("Store deleted>>", store);
  req.flash("success", "Store deleted!");
  res.redirect("/stores");
};
