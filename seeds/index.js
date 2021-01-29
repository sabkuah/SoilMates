const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Plant = require("../models/plant");
const plants = require("./plants");
const dotEnv = require("dotenv");

dotEnv.config();
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

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

seedPlants().then(() => {
  console.log("Plants seeded successfully!");
  mongoose.connection.close();
});
