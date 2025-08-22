const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        immutable: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        minLength: 3,
        maxLength: 20,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    problemSolved: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem"
        }],
        unique: true
    },
    upvoted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem"
    }],
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
});

userSchema.post("findOneAndDelete", async function (userInfo) {
    if(userInfo) {
        await mongoose.model("Submission").deleteMany({ userId: userInfo._id });
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;