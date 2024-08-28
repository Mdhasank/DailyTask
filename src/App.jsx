import Navbar from './Navbar';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Handle task editing
  const handleEdit = (id) => {
    const taskToEdit = tasks.find((t) => t.id === id);
    setTask(taskToEdit.task);
    setIsEdit(true);
    setEditId(id);
  };

  // Handle task deletion
  const handleDelete = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };


  // Handle adding or updating a task
  const handleAddOrUpdate = () => {
    if (isEdit) {
      if (task.trim()) {
        setTasks(tasks.map((t) => t.id === editId ? { ...t, task } : t));
        setIsEdit(false);
      } else {
        setIsEdit(false);
        setEditId(null);
      }
      setEditId(null);
      setIsEdit(false);
    } else if (task.trim()) {
      setTasks([...tasks, { id: uuidv4(), task, isCompleted: false }]);
    }
    setTask("");
  };

  // Handle input change
  const handleChange = (e) => {
    setTask(e.target.value);
  };

  // Handle checkbox toggle
  const handleCheckbox = (e) => {
    const id = e.target.name;
    const isChecked = e.target.checked;
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, isCompleted: isChecked } : task
      )
    );
  };

  return (
    <>
      <Navbar />
      <div className='container mx-auto my-5 rounded-md p-3'>
        <div className='flex flex-col sm:flex-row items-center'>
          <input
            onChange={handleChange}
            value={task}
            type="text"
            placeholder='Add a new task'
            className='flex-grow p-2 w-full sm:w-auto sm:max-w-xs bg-neutral-300 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-transparent'
          />
          <button
            onClick={handleAddOrUpdate}
            className='mt-3 sm:mt-0 sm:ms-3 navbg textcolor hover:bg-neutral-800 text-white font-bold py-2 px-4 rounded w-full sm:w-auto'>
            {isEdit ? "Update Task" : "Add Task"}
          </button>
        </div>
        <h2 className='text-xl textcolor font-bold mt-5'>
        Tasks
        </h2>
        <ul className='list-none p-0 mt-3 flex flex-col gap-2'>
          {
            tasks.length === 0 && <p className='text-gray-600 text-center text-2xl opacity-45'> No tasks available</p>
          }
          {tasks.map(item => (
            <li key={item.id} className={`${item.isCompleted ? "opacity-30" : "completed_bg"} flex items-center p-2 rounded-md transition duration-300`}>
              <input
                type="checkbox"
                onChange={handleCheckbox}
                name={item.id}
                checked={item.isCompleted}
                className="w-4 h-4  border-gray-400 rounded-sm focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100"
              />
              <p className={`ml-2 text-base text-white ${item.isCompleted ? "line-through" : ""}`}>
                {item.task}
              </p>
              <div className="flex gap-2 p-2 ml-auto">
                <button
                  onClick={() => { handleEdit(item.id); }}
                  className=" font-bold p1-1 rounded">
                  <i className="fa-solid fa-file-pen textcolor"></i>
                </button>
                <button
                  onClick={() => { handleDelete(item.id); }}
                  className=" font-bold p-1 rounded">
                  <i className="fa-regular fa-trash-can textcolor"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
