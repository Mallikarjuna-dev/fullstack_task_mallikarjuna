const express = require("express");
const router = express.Router();
const { fetchAllTasks } = require("../controllers/taskController");

router.get("/fetchAllTasks", async (req, res) => {
    try {
        const tasks = await fetchAllTasks();
        res.json(tasks);
    } catch (error) {
        console.error('Error in /fetchAllTasks route:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;