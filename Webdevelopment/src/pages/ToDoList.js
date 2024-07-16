//Todolist.js
import React, { useState, useEffect } from 'react';
import './ToDoList.css';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear'; 
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

function ToDoList({ updateProgress }) {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [progress, setProgress] = useState(0); 
  const [showProgressTracker, setShowProgressTracker] = useState(false); 

  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  const handleAddTask = () => {
    if (task.trim() !== '') {
      const newTasks = [...tasks, { name: task, completed: false }];
      setTasks(newTasks);
      updateProgressStatus(newTasks);
      setTask('');
    }
  };

  const handleDeleteTask = (taskToDelete) => {
    const newTasks = tasks.filter(task => task.name !== taskToDelete.name);
    setTasks(newTasks);
    updateProgressStatus(newTasks);
  };

  const handleCompleteTask = (taskToComplete) => {
    const newTasks = tasks.map(task =>
      task.name === taskToComplete.name ? { ...task, completed: true } : task
    );
    setTasks(newTasks);
    updateProgressStatus(newTasks);
  };

  const handleClearTask = (taskToClear) => {
    const newTasks = tasks.map(task =>
      task.name === taskToClear.name ? { ...task, completed: false } : task
    );
    setTasks(newTasks);
    updateProgressStatus(newTasks);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const updateProgressStatus = (tasks) => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const newProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    setProgress(newProgress);
    setShowProgressTracker(totalTasks > 0); 
    updateProgress(completedTasks, totalTasks); 
  };

  useEffect(() => {
    updateProgressStatus(tasks);
  }, [tasks]);

  const filteredTasks = tasks.filter(task =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  return (
    <div className="todo-container">
      <h5>To-Do List</h5>
      <p style={{ color: "blue" }}>(Turn your to-dos into ta-das)</p>
      <div className="add-task-container">
        <input
          type="text"
          value={task}
          onChange={handleInputChange}
          placeholder="Add a new task"
        />
        <button className='add-button' onClick={handleAddTask}><AddIcon/></button>
      </div>
      <div className='add-task-container'>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search tasks"
      /><button className='add-button' onClick={handleSearch}><SearchIcon/></button>
      </div>
      {incompleteTasks.length > 0 && (
        <>
          <h6>Incomplete Tasks</h6>
          <ul>
            {incompleteTasks.map((task, index) => (
              <li key={index}>
                {task.name}
                <div className="task-buttons">
                  <button className="task-button" onClick={() => handleCompleteTask(task)}><DoneIcon /></button>
                  <button className="task-button" onClick={() => handleDeleteTask(task)}><DeleteIcon /></button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      {completedTasks.length > 0 && (
        <>
          <h6>Completed Tasks</h6>
          <ul>
            {completedTasks.map((task, index) => (
              <li key={index}>
                {task.name}
                <div className='task-buttons'>
                  <button className="task-button" onClick={() => handleClearTask(task)}><ClearIcon /></button>
                  <button className="task-button" onClick={() => handleDeleteTask(task)}><DeleteIcon /></button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {showProgressTracker && (
        <div className="progress-tracker-container">
          <h3>Progress Tracker</h3>
          <p>Task Completion: {progress.toFixed(2)}%</p>
          <progress value={progress} max="100"></progress>
        </div>
      )}
    </div>
  );
}

export default ToDoList;

