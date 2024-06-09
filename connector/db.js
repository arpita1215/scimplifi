/** @format */
const mongoose = require("mongoose");
console.log(process.env.MONGODB_URL)
module.exports.initDB = async function () {
  await mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
};
