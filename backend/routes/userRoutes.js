const express = require("express");
const { registerUser, loginUser, logout, registerEvent, deRegister } = require("../controllers/userController");
const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router.route("/registerEvent").put(registerEvent);

router.route("/deregisterEvent").put(deRegister);

module.exports = router;