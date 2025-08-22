const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const redisClient = require("../config/redisClient");

const adminMiddleware = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token) throw new Error("Unauthorized");

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = payload;
        if(!_id) throw new Error("Invalid token");

        const result = await User.findById(_id);
        if(!result) throw new Error("User not found");

        if(payload.role !== 'admin') {
            throw new Error("User is not an admin");
        }

        const isBlocked = await redisClient.exists(`token:${token}`);
        if(isBlocked) throw new Error("User is blocked");

        req.user = result;
        next();

    } catch (error) {
        console.error("Error in authMiddleware:", error);
        res.status(401).json({ message: error.message });
    }
};

module.exports = adminMiddleware;