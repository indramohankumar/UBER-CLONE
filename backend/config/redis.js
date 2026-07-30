const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:6379`;
const redisClient = createClient({
    url: redisUrl,
});

redisClient.on("connect", () => {
    console.log("✅ Connected to Redis");
});

redisClient.on("error", (err) => {
    console.error(" Redis Error:", err);
});

redisClient.connect().catch(console.error);

module.exports = redisClient;