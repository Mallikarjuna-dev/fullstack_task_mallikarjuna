import axios from 'axios';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Task from './Task';

const socket = io('https://kazam-ev-task.onrender.com');

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get('https://kazam-ev-task.onrender.com/api/fetchAllTasks');
                setTasks(res.data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();

        socket.on('taskAdded', (task) => {
            setTasks((prevTasks) => [...prevTasks, task]);
        });
        return () => {
            socket.off('taskAdded');
        };
    }, []);

    const handleAddTask = () => {
        socket.emit('add', newTask);
        setNewTask("");
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-black">Task List</h1>
            <div>
                <input
                    className='flex-grow p-2 border rounded-md focus:outline-none shadow-md'
                    type='text'
                    value={newTask}
                    placeholder='Add a new task'
                    onChange={(e) => setNewTask(e.target.value)} />
                <button className="bg-amber-800 text-white p-2 rounded-md pl-4 pr-4" onClick={handleAddTask}>Add task</button>
            </div>
            {tasks.map((task, index) => (
                <Task key={index} description={task.description} createdAt={task.createdAt} />
            ))}
        </div>
    )
}

export default TaskList;