import React from 'react'

const Task = ({ tasks }) => {
    // console.log(tasks)

    return (
        <>
            <h2 className="font-bold text-xl px-1 underline-container py-1 border-b-2">Tasks</h2>
            <ul className="list-disc pl-1 overflow-y-auto h-56 divide-y divide-slate-700">
                {tasks?.map(task => (
                    <li key={task.id} className="flex justify-evenly py-2 px-2 underline-container">
                        <div>
                            <strong className="text-lg">{task.name}</strong>
                        </div>
                        <div className='text-sm ml-12 mt-1'><p>{new Date(task.id).toLocaleString()}</p></div>
                    </li>
                ))}
            </ul>
        </>
    )
};

export default Task;