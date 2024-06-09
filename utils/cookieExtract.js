/** @format */

module.exports.authCookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) token = req.cookies["auth_tk"];
  return token;
};
