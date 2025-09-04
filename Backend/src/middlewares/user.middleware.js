const redisClient = require("../config/redisClient");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");



// const authMiddleware = async (req, res, next) => {
//     try {
//         const {token} = req.cookies;
//         if(!token) throw new Error("Unauthorized");

//         const payload = jwt.verify(token, process.env.JWT_SECRET);
//         const { _id } = payload;
//         if(!_id) throw new Error("Invalid token");

//         const result = await User.findById(_id);
//         if(!result) throw new Error("User not found");

//         const isBlocked = await redisClient.exists(`token:${token}`);
//         if(isBlocked) throw new Error("User is blocked");

//         req.user = result;
//         next();

//     } catch (error) {
//         console.error("Error in authMiddleware:", error);
//         res.status(401).json({ message: error.message });
//     }
// };

const refreshTokens = async (refreshToken) => {
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const { _id } = payload;
        if (!_id) throw new Error("Invalid token");

        const user = await User.findById(_id);
        if (!user) throw new Error("User not found");
        
        const userInfo = {
            _id: user._id,
            name: user.firstName,
            email: user.email,
            role: user.role
        };

        const newAccessToken = generateAccessToken(userInfo);

        const newRefreshToken = generateRefreshToken(userInfo._id);

        return { newAccessToken, newRefreshToken, user: userInfo };
    } catch (error) {
        console.log(error.message);
    }
};

const authMiddleware = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = req.cookies;
        req.user = null;

        if (!accessToken && !refreshToken) throw new Error("Unauthorized");

        if (accessToken) {
            try {
                const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
                const { _id } = payload;
                if (!_id) throw new Error("Invalid token");

                const result = await User.findById(_id);
                if (!result) throw new Error("User not found");

                const isBlocked = await redisClient.exists(`refreshToken:${refreshToken}`);
                if (isBlocked) throw new Error("User is blocked");

                req.user = result;
                return next();
            } catch (error) {
                if(!accessToken) return res.status(401).json({ message: "Unauthorized" });
            }
        }

        if(refreshToken) {
            try {
                const { newAccessToken, newRefreshToken, user } = await refreshTokens(refreshToken);

                const baseConfig = {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    path: '/',
                };

                res.cookie("accessToken", newAccessToken, { ...baseConfig, maxAge: 15 * 60 * 1000 }); // 15 minutes
                res.cookie("refreshToken", newRefreshToken, { ...baseConfig, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days

                req.user = user;
                return next();
            } catch (error) {
                res.status(401).json({ message: error.message });
            }
        }
    } catch (error) {
        console.error("Error in authMiddleware:", error);
        res.status(401).json({ message: error.message });
    }
};

module.exports = authMiddleware;