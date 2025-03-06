const mongoose = require("mongoose");

const dbUrl = process.env.DATABASE;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log("err", err);
  });
