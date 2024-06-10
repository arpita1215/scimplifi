const router = require("express").Router();
const USERS = require("../models/User");
const passport = require("passport");
const { encryptPassword, verifyPassword } = require("../utils/PasswordUtil");
const {
  verifyJWT,
  signJWT,
  setCookie,
  clearCookie,
} = require("../utils/tokenUtil");

const multer = require("multer");
const { STORAGE } = require("../config/Storage.multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

router.post("/signup", async (req, res) => {
  try {
    const isUserExit = await USERS.findOne({
      email: req.body.email,
    });

    if (isUserExit) {
      return res.status(400).json({
        error: "User already exist",
        success: false,
      });
    }

    const { name, email, password, profilePic } = req.body;

    let newUser;

    newUser = new USERS({
      name,
      email,
      password,
      profilePic,
    });

    newUser.password = await encryptPassword(password);
    newUser.save().then((generatedUser) => {
      res.json({
        user: generatedUser,
        success: true,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      success: false,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await USERS.findOne({
    email,
  });

  if (!user)
    return res.status(400).json({
      message: "User not found",
      success: false,
    });

  const isPasswordMatch = await verifyPassword(password, user.password);

  if (!isPasswordMatch)
    return res.status(400).json({
      message: "Please check email and password",
      success: false,
    });

  const payloaduser = {
    id: user.id,
    name: user.firstname + " " + user.lastname,
  };

  const token = await signJWT(payloaduser);
  setCookie(res, token);
  return res.json({
    success: true,
    type: user.type,
  });
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage: storage });

router.post(
  "/upload-picture",
  upload.single("image"),
  passport.authenticate("user", {
    session: false,
  }),
  async (req, res) => {
    try {
      console.log(req.file);
      console.log(req.user);
      await USERS.findByIdAndUpdate(req.user.id, { profilePic: req.file.path });
      return res.json({ success: true });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
);

router.get(
  "/view-picture",
  passport.authenticate("user", {
    session: false,
  }),
  async (req, res) => {
    try {
      const profileImage = await USERS.findById(req.user.id, { profilePic: 1 });

      return res.json({ success: true, profileImage });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }
);

router.get("/logout", function (req, res) {
  clearCookie(res);
  return res.json({
    success: true,
  });
});

module.exports = router;
