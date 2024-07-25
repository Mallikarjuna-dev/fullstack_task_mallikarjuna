const express = require("express");
const { fetchAllTasks } = require("../controllers/taskController");
const router = express.Router();

router.get("/fetchAllTasks", async (req, res) => {
    try {
        const tasks = await fetchAllTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500);
        throw new Error(error);
    }
});

module.exports = router;