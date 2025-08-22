require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.routes");
const problemRouter = require("./routes/problem.routes");
const submissionRouter = require("./routes/submission.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(cookieParser());


app.use("/api/v1/users", userRouter);
app.use("/api/v1/problems", problemRouter);
app.use("/api/v1/submissions", submissionRouter);

module.exports = app;