const mongoose = require("mongoose");
const {data} = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.DATABASE;
console.log(dbUrl)

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log("err", err);
  });

ownerId = process.env.OWNER_ID;
const initDB = async () => {
  await Listing.deleteMany({});
  userData = data.map((obj) => ({...obj, owner: ownerId}))
  await Listing.insertMany(userData);
  console.log("data was initialized");
};

initDB();