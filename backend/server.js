const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
// const { addTask } = require("./controllers/taskController");
// const taskRoutes = require("./routes/taskRoutes");
const { redisClient } = require("./configs/config");
const Task = require("./models/Task");

app.use(cors());

app.use(bodyParser.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// controllers code for functions
const TASK_KEY = 'FULLSTACK_TASK_MALLIKARJUNA';
let tasks = [];

async function loadTasksFromRedis() {
    const tasksData = await redisClient.get(TASK_KEY);
    tasks = tasksData ? JSON.parse(tasksData) : [];
}

loadTasksFromRedis();

async function saveTasksToRedis() {
    await redisClient.set(TASK_KEY, JSON.stringify(tasks));
    console.log('Tasks saved to Redis:', tasks);
}

async function moveTasksToMongoDB() {
    if (tasks.length >= 50) {
        console.log('Moving tasks to MongoDB:', tasks);
        try {
            await Task.insertMany(tasks);
            tasks = [];
            await redisClient.del(TASK_KEY);
            console.log('Tasks moved to MongoDB and Redis cache cleared');
        } catch (error) {
            console.error('Error moving tasks to MongoDB:', error);
        }
    }
}

// app.get('/fetchAllTasks', (req, res) => {
//     res.json(tasks);
// });

app.get("/fetchAllTasks", (req, res) => {
    res.json(tasks);
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('add', async (task) => {
        tasks.push(task);
        // await addTask(task);
        await saveTasksToRedis();
        await moveTasksToMongoDB();
        io.emit('taskAdded', task);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});