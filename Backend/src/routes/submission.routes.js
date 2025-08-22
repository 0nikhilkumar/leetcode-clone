const express = require("express");
const authMiddleware = require("../middlewares/user.middleware");
const { submitCode, runCode } = require("../controllers/submission.controller");
const submitCodeRateLimiter = require("../utils/rateLimiter");
const router = express.Router();

router.route("/submit/:id").post(authMiddleware, submitCodeRateLimiter, submitCode);
router.route("/run/:id").post(authMiddleware, submitCodeRateLimiter, runCode);


module.exports = router;