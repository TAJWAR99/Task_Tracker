import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";

function App() {
  // const name = 'Brad';
  // const x = true;
  const [showAddTask, setShowAddTask] = useState(false)

  const [tasks, setTasks] = useState([
    // {
    //   "id": 1,
    //   "text": "Doctor Appointment",
    //   "day": "Feb 5th",
    //   "reminder": true
    // },
    // {
    //   "id": 2,
    //   "text": "Meeting At School",
    //   "day": "Feb 6th",
    //   "reminder": true
    // }
  ])

  useEffect(() => {
    const getTasks = async () => {
      const taskFromServer = await fetchTasks()
      setTasks(taskFromServer)
    }
    getTasks()
  }, [])
  //Fetch task
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }
  //Fetch task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data
  }
  //Delete Task
  const deleteTask = async (id) => {

    await fetch(`http://localhost:5000/tasks/${id}`,{
      method: 'DELETE',
    })
    setTasks(tasks.filter((task) => task.id !== id))
  }
  //Toogle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updateTask = {
      ...taskToToggle, reminder: !taskToToggle.reminder
    }
    const res = await fetch(`http://localhost:5000/tasks/${id}`,{
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updateTask)
    })

    const data = await res.json()

    setTasks(tasks.map((task) => 
    task.id === id ? {...task, reminder : data.reminder} : task))
  }
  //Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks',{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    const data = await res.json()
    setTasks([...tasks,data])
    // const id = Math.floor(Math.random()*10000) + 1
    // const newTask = {id, ...task}
    // setTasks([...tasks,newTask])
  }
  return (
    <Router>
      <div className="container">
        <Header onAdd={ () => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>

        <Route path='/' exact render={(props) => (
          <>
            {showAddTask && <AddTask onAdd={addTask}/>} 
            {tasks.length > 0 ?
              <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>
              : 'No Tasks remaining'
            }
          </>
        )}/>
        <Route path='/about' component={About} />
        <Footer />
        {/* <h1>Hello World</h1>
        <h3>Hello {name}</h3>
        <h4>Hello {x ? 'Yes' : 'No'}</h4> */}
      </div>
    </Router>
  );
}

export default App;