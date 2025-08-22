const User = require("../models/user.model");
const validate = require("../utils/validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redisClient = require("../config/redisClient");

const register = async (req, res) => {
    try {
        validate(req.body);

        const existingUser = await User.findOne({email: req.body.email});
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        req.body.role = "user";
        req.body.username = req.body.email.split("@")[0];
        const newUser = new User(req.body);
        await newUser.save();

        const token = jwt.sign({ _id: newUser._id, email: req.body.email, role: "user" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {maxAge: 60*60*1000});

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const existsUser = await User.findOne({email});
        if(!existsUser) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isPasswordMatched = await bcrypt.compare(password, existsUser.password);
        if(!isPasswordMatched) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({_id: existsUser._id, email, role: existsUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

        res.status(200).send("Login successful");
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, 'Blocked');
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.clearCookie("token");
        res.status(200).send("Logout successful");
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const adminRegister = async (req, res) => {
    try {
        if(req.user.role !== 'admin') throw new Error("Invalid credentials");

        validate(req.body);

        const {firstName, email, password} = req.body;

        req.body.password = await bcrypt.hash(password, 10);
        req.body.role = "admin";
        req.body.username = req.body.email.split("@")[0];
        const newUser = new User(req.body);
        await newUser.save();

        const token = jwt.sign({ _id: newUser._id, email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

        res.status(201).send("Admin registered successfully");
    } catch (error) {
        console.error("Error during admin registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndDelete(userId);

        return res.status(200).send("Deleted successfully");
    } catch (error) {
        console.error("Error during profile deletion:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const userProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate({
            path: "problemSolved",
            select: "_id title difficulty tags"
        }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    register,
    login,
    logout,
    adminRegister,
    deleteProfile,
    userProfile
};