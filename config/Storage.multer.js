const multer = require("multer");

module.exports.STORAGE = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});