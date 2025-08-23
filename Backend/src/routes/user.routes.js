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

router.route("/check-auth").get(authMiddleware, (req, res) => {
    const reply = {
        email: req.user.email,
        firstName: req.user.firstName,
        _id: req.user._id,
        role: req.user.role
    };
    res.status(200).json({ user: reply, message: "Valid User" });
});

module.exports = router;