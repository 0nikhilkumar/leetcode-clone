const express = require("express");
const { register, login, logout, adminRegister, deleteProfile, userProfile } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/user.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(authMiddleware, logout);
router.route("/admin/register").post(adminMiddleware, adminRegister);
router.route("/deleteProfile").delete(authMiddleware, deleteProfile);
router.route("/profile").get(authMiddleware, userProfile);

module.exports = router;