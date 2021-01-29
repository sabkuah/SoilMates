const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Plant = require("../models/plant");
const plants = require("./plants");

//Connect Database
// mongoose.connect("mongodb://localhost:27017/soil-mates", {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   useCreateIndex: true,
// });

mongoose.connect(
  "mongodb+srv://sabkuah:Helloitsme2020!@cluster0.dscvz.mongodb.net/soil-mates?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

//Seeder Functions
const seedPlants = async () => {
  await Plant.deleteMany({});
  for (let i = 0; i < plants.length; i++) {
    const newPlant = new Plant(plants[i]);
    await newPlant.save();
  }
};

// const seedStores = async () => {
//   await Store.deleteMany({});
//   for (let i = 0; i < stores.length; i++) {
//     const newStore = new Store(stores[i]);
//     await newStore.save();
//   }
// };

// name: plants[i].name,
// image: plants[i].name,
// type: plants[i].name,
// water: plants[i].name,
// light: plants[i].name,
// description: plants[i].name,
// isPetFriendly: plants[i].name,

seedPlants().then(() => {
  console.log("Plants seeded successfully!");
  mongoose.connection.close();
});
