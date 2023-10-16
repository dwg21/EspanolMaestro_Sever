const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  googleLogin,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/googlelogin", googleLogin);

module.exports = router;
