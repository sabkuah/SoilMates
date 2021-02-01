const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Plant = require("../models/plant");
const Store = require("../models/store");
const plants = require("./plants");
const stores = require("./stores");
const dotEnv = require("dotenv");

dotEnv.config();
//const dbUrl = process.env.DB_URL;
const dbUrl = "mongodb://localhost:27017/yelp-camp";

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
const seedApp = async () => {
  await Plant.deleteMany({});
  for (let i = 0; i < plants.length; i++) {
    const newPlant = new Plant(plants[i]);
    await newPlant.save();
  }
  await Store.deleteMany({});
  for (let i = 0; i < stores.length; i++) {
    const newStore = new Store(stores[i]);
    await newStore.save();
  }
};

seedApp().then(() => {
  console.log("Soil-Mates app seeded successfully!");
  mongoose.connection.close();
});
