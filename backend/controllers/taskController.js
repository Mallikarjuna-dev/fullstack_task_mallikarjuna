const redisClient = require("../configs/config");
const Task = require("../models/taskModel");

const TASK_KEY = "FULLSTACK_TASK_MALLIKARJUNA";

const addTask = async (task) => {
    try {
        // const tasks = await redisClient.get(TASK_KEY);
        // const taskList = tasks ? JSON.parse(tasks) : [];
        // taskList.push({ description, createdAt: new Date() });

        const tasks = await redisClient.lRange(TASK_KEY, 0, -1);
        tasks.push(task);

        if (taskList.length > 50) {
            // await Task.insertMany(taskList);
            await Task.insertMany(tasks.map(t => ({ description: t, createdAt: new Date() })));
            await redisClient.del(TASK_KEY);
        } else {
            await redisClient.rPush(TASK_KEY, JSON.stringify(tasks));
        }
    } catch (error) {
        console.error('Error adding task:', error);
    }
};

const fetchAllTasks = async (req, res) => {
    try {
        // const tasks = await redisClient.set(TASK_KEY);
        const tasks = await redisClient.lRange(TASK_KEY, 0, -1);
        if (tasks.length === 0) {
            // Fetch tasks from MongoDB
            const dbTasks = await Task.find({});
            res.json(dbTasks);
        } else {
            res.json(tasks.map(t => ({ description: t, createdAt: new Date() })));
        }
        // const taskList = tasks ? JSON.parse(tasks) : [];
        // const dbTasks = await Task.find({});
        // return [...taskList, ...dbTasks];
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addTask, fetchAllTasks };