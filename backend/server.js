const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const { addTask } = require("./controllers/taskController");
const taskRoutes = require("./routes/taskRoutes");
require("./configs/config")

require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', taskRoutes);

const server = http.createServer(app);

const allowedOrigins = [
    'http://localhost:3000',
];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
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

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});