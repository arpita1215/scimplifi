/** @format */

const bcrypt = require("bcryptjs");

module.exports.verifyPassword = async function (password, hashedPassword) {
  let respose = await bcrypt.compare(password, hashedPassword);
  return respose;
};

module.exports.encryptPassword = async function (originalString) {
  const hash = await bcrypt.hash(originalString, 10);
  return hash;
};
