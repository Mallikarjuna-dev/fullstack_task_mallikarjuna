const redis = require("redis");
const mongoose = require("mongoose");

const redisClient = redis.createClient({
    url: "redis://default:dssYpBnYQrl01GbCGVhVq2e4dYvUrKJB@redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com:12675"
});

redisClient.connect().catch(console.error);

mongoose.connect("mongodb+srv://assignment_user:HCgEj5zv8Hxwa4xO@test-cluster.6f94f5o.mongodb.net/assignment").then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on('error', (err) => {
    console.log('Redis client error:', err);
});

module.exports = { redisClient, mongoose };