const { createClient } = require("redis");

const redisHost = process.env.REDIS_HOST || "localhost";
const redisClient = createClient({
    url: `redis://${redisHost}:6379`,
});

redisClient.on("connect", () => {
    console.log("✅ Connected to Redis");
});

redisClient.on("error", (err) => {
    console.error(" Redis Error:", err);
});

redisClient.connect().catch(console.error);

module.exports = redisClient;