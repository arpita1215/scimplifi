/** @format */

const jwt = require("jsonwebtoken");
const key = process.env.JWT_SECRET || "$$demoUserDevSECRET%%";

const verifyToken = (token) => {
  if (!token) return false;
  return new Promise((resolve, reject) =>
    jwt.verify(token, key, (err, decoded) =>
      err ? reject(false) : resolve(decoded.id)
    )
  );
};

module.exports.verifyJWT = async function (jwt) {
  return await verifyToken(jwt);
};

module.exports.signJWT = async function (payload) {
  return jwt.sign(payload, key, { expiresIn: 10800 * 8 });
};

module.exports.setCookie = async function (res, token) {
  var date = new Date();
  date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
  res.cookie("auth_tk", token, {
    expires: date,
  });
};

module.exports.clearCookie = async function (res) {
  res.clearCookie("auth_tk");
};
