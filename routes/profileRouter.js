const express = require("express");
const router = express.Router();
const profile = require("../controllers/profileController");
const { upload } = require("../middlewares/multer");
const { isAuthenticatedUser } = require("../middlewares/auth");
router
  .post(
    "/createProfile",
    isAuthenticatedUser,
    upload.fields([
      { name: "profileImage", maxCount: 1 },
      { name: "frontImage", maxCount: 1 },
      { name: "backImage", maxCount: 1 },
    ]),
    profile.createProfile
  )
  .get("/getProfile", profile.getProfile)
  .put(
    "/updateProfile",
    isAuthenticatedUser,
    upload.fields([
      { name: "profileImage", maxCount: 1 },
      { name: "frontImage", maxCount: 1 },
      { name: "backImage", maxCount: 1 },
    ]),
    profile.updateProfile
  )
  .delete("/deleteProfile/:id", isAuthenticatedUser, profile.deleteProfile);

exports.router = router;
