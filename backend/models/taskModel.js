const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model('assignment_mallikarjuna', taskSchema);

module.exports = Task;