const app = require("./src/app");
const connectDB = require("./src/config/db");
const redisClient = require("./src/config/redisClient");

const PORT = process.env.PORT || 3000;

const initializeConnection = async () => {
    try {
        await Promise.all([connectDB(), redisClient.connect()]);
        console.log("Redis Connected");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Error connecting to DB:", error);
    }
};

initializeConnection();


