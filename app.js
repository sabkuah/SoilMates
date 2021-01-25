const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

//CONNECT DATABASE
mongoose.connect("mongodb://localhost:27017/soil-mates", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

//MIDDLEWARE
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.send("Welcome to soil mates!");
});

app.listen(5000, () => {
  console.log("App running on Port 5000...");
});
