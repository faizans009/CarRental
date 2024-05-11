const express = require("express");
const router = express.Router();
const profile = require("../controllers/profileController");
const { isAuthenticatedUser } = require("../middlewares/auth");
router
  .post("/createProfile", isAuthenticatedUser, profile.createProfile)
  .get("/getProfile", profile.getProfile)
  .get("/getProfileById/:id", profile.getProfileById)
  .put("/updateProfile", isAuthenticatedUser, profile.updateProfile)
  .delete("/deleteProfile/:id", isAuthenticatedUser, profile.deleteProfile);

exports.router = router;
