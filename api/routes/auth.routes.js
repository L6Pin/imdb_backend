const express = require("express");
const passport = require("passport");
const authController = require("../controllers/auth.controller");

const router = express.Router();
require("../../auth");

router.post("/registration", authController.registration);
router.post("/login", authController.login);
router.get("/users/verify/:id/:token", authController.userVerification);
router.get("/facebook", passport.authenticate("facebook"));
router.get("/facebook/callback",passport.authenticate("facebook", {successRedirect: "http://localhost:4200"}));
router.get("/login/success", authController.facebookLogin);

module.exports = router;
