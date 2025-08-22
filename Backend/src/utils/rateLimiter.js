const redisClient = require("../config/redisClient");

const submitCodeRateLimiter = async (req, res, next) => {
    const userId = req.user._id;
    const redisKey = `submit_cooldown:${userId}`;

    try {
        const exists = await redisClient.exists(redisKey);
        
        if(exists) {
            return res.status(429).json({ message: "Too many requests, wait for 10 seconds" });
        }

        await redisClient.set(redisKey, "cooldown_active", {
            EX: 10, // Expire in 10 seconds
            NX: true // Only set if not exists
        });

        next();
    } catch (error) {
        console.error("Redis error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = submitCodeRateLimiter;