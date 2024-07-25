const redisClient = require("../configs/config");
const Task = require("../models/taskModel");

const TASK_KEY = "FULLSTACK_TASK_MALLIKARJUNA";

const addTask = async (description) => {
    const tasks = await redisClient.get(TASK_KEY);
    const taskList = tasks ? JSON.parse(tasks) : [];

    taskList.push({ description, createdAt: new Date() });

    if (taskList.length > 50) {
        await Task.insertMany(taskList);
        await redisClient.del(TASK_KEY);
    } else {
        await redisClient.set(TASK_KEY, JSON.stringify(taskList));
    }
};

const fetchAllTasks = async () => {
    const tasks = await redisClient.get(TASK_KEY);
    const taskList = tasks ? JSON.parse(tasks) : [];
    const dbTasks = await Task.find({});
    return [...taskList, ...dbTasks];
};

module.exports = { addTask, fetchAllTasks };