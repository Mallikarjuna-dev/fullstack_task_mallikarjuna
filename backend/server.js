const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const { addTask } = require("./controllers/taskController");
require("dotenv").config();

const port = process.env.PORT || 8080;

app.use(cors())
app.use(bodyParser.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('add', async (task) => {
        await addTask(task);
        io.emit('taskAdded', task);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.listen(port, () => {
    console.log(`Json server running on port ${port}`);
});