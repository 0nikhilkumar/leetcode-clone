const express = require("express");
const adminMiddleware = require("../middlewares/admin.middleware");
const { createProblem, getAllProblems, getProblemById, getAllUserSolvedProblems, updateProblem, deleteProblem, submittedProblem } = require("../controllers/problem.controller");
const authMiddleware = require("../middlewares/user.middleware");
const submitCodeRateLimiter = require("../utils/rateLimiter");
const router = express.Router();

router.route("/create").post(adminMiddleware, submitCodeRateLimiter, createProblem);
router.route("/update/:id").put(adminMiddleware, submitCodeRateLimiter, updateProblem);
router.route("/delete/:id").delete(adminMiddleware, deleteProblem);
router.route("/getProblemById/:id").get(adminMiddleware, getProblemById);

router.route("/getAllProblem").get(getAllProblems);
router.route("/problemById/:id").get(authMiddleware, getProblemById);
router.route("/problemSolvedByUser").get(authMiddleware, getAllUserSolvedProblems);
router.route("/submittedProblem/:id").get(authMiddleware, submittedProblem);



module.exports = router;