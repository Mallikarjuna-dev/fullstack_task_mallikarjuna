import React from 'react'

const Task = ({ description, createdAt }) => {
    console.log(new Date(createdAt).toLocaleString())
    return (
        <div className='task-item'>
            <p>{description}</p>
            <small>{new Date(createdAt).toLocaleString()}</small>
        </div>
    )
};

export default Task;