import axios from 'axios';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Task from './Task';
// import Task from './Task';

// const socket = io('http://localhost:8080');
const socket = io('https://kazam-ev-task.onrender.com');

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('https://kazam-ev-task.onrender.com/fetchAllTasks');
                const fetchedTasks = Array.isArray(response.data) ? response.data : [];
                console.log(fetchedTasks)
                setTasks(fetchedTasks);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setError('Error fetching tasks');
                setLoading(false);
            }
        };
        fetchTasks()

        // axios.get('https://kazam-ev-task.onrender.com/fetchAllTasks')
        //     .then((response) => {
        //         console.log(response.data)
        //         setTasks(response.data);
        //         setLoading(false);
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching tasks:', error);
        //         setError('Error fetching tasks');
        //         setLoading(false);
        //     });

        socket.on('taskAdded', (tasks) => {
            console.log("tasks", tasks);
            setTasks((prevTasks) => [...prevTasks, tasks]);
        });

        socket.on('connect_error', (err) => {
            console.error('WebSocket connection error:', err);
            setError('WebSocket connection error');
        });

        return () => {
            socket.off('taskAdded');
            socket.off('connect_error');
        };
    }, []);

    const handleAddTask = () => {
        if (!task.trim()) {
            setError('Task cannot be empty');
            return;
        }
        const newTask = { id: new Date().toISOString(), name: task };
        socket.emit('add', newTask);
        setTask('');
        setError(null);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4 flex items-center">
                    Task List
                </h1>
                <div className="flex mb-3">
                    <input
                        type="text"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="Enter new tasks..."
                        className="border rounded-l p-2 flex-grow mr-2"
                    />
                    <button
                        onClick={handleAddTask}
                        className="bg-blue-500 text-white px-3 py-2 font-semibold rounded-r"
                    >
                        Add Task
                    </button>
                </div>
                {loading ? (
                    <p className="text-gray-500">Loading tasks...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <Task tasks={tasks} />
                )}
            </div>
        </div >
    )
}

export default TaskList;