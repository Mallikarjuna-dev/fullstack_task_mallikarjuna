const redis = require("redis");
const mongoose = require("mongoose");

const redisClient = redis.createClient({
    url: "redis://default:dssYpBnYQrl01GbCGVhVq2e4dYvUrKJB@redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com:12675"
});

redisClient.on("error", (err) => console.log("Redis client error", err));

(async () => {
    await redisClient.connect();
})();

mongoose.connect("mongodb+srv://assignment_user:HCgEj5zv8Hxwa4xO@test-cluster.6f94f5o.mongodb.net/assignment");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = { redisClient, db };