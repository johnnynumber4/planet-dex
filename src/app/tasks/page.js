'use client';

import { useEffect, useState } from 'react';
import { workflowStates } from '../../constants/constants';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState(''); // New state for task description
  const [newTaskState, setNewTaskState] = useState(workflowStates[0]); // Default to the first state
  const [newTaskProjectId, setNewTaskProjectId] = useState('');
  const [newTaskEpic, setNewTaskEpic] = useState('');
  const [newTaskSprint, setNewTaskSprint] = useState('');
  const [newTaskAssignedPerson, setNewTaskAssignedPerson] = useState('');
  const [allProjects, setAllProjects] = useState([]);
  const [projectMap, setProjectMap] = useState({});
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data.tasks);
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setAllProjects(data.projects);

      // Create a mapping of project IDs to project names
      const projectMapping = {};
      data.projects.forEach(project => {
        projectMapping[project._id] = project.name;
      });
      setProjectMap(projectMapping);
    }
    fetchProjects();
  }, []);

  const handleCreateTask = async () => {
    if (!newTask.trim()) {
      alert('Task title cannot be empty');
      return;
    }

    const task = {
      title: newTask,
      taskDescription: newTaskDescription,
      state: newTaskState,
      projectId: newTaskProjectId, // Save project ID instead of name
      epic: newTaskEpic,
      sprint: newTaskSprint,
      assignedPerson: newTaskAssignedPerson
    };

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    if (response.ok) {
      const data = await response.json();
      setTasks([...tasks, data.task]);
      setNewTask('');
      setNewTaskDescription(''); // Reset the description field
      setNewTaskState(workflowStates[0]); // Reset to the first state
      setNewTaskProjectId('');
      setNewTaskEpic('');
      setNewTaskSprint('');
      setNewTaskAssignedPerson('');
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask.title.trim()) {
      alert('Task title cannot be empty');
      return;
    }

    const response = await fetch(`/api/tasks/${editingTask._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editingTask)
    });

    if (response.ok) {
      const updatedTask = await response.json();
      setTasks(tasks.map(task => (task._id === updatedTask._id ? updatedTask : task)));
      setEditingTask(null);
    }
  };

  const startEditingTask = (task) => {
    setEditingTask({ ...task });
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  return (
    <div>
      <h1>Tasks</h1>
      <div>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        />
        <select
          value={newTaskState}
          onChange={(e) => setNewTaskState(e.target.value)}
        >
          {workflowStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          value={newTaskProjectId}
          onChange={(e) => setNewTaskProjectId(e.target.value)}
        >
          <option value="">Select Project</option>
          {allProjects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Epic"
          value={newTaskEpic}
          onChange={(e) => setNewTaskEpic(e.target.value)}
        />
        <input
          type="text"
          placeholder="Sprint"
          value={newTaskSprint}
          onChange={(e) => setNewTaskSprint(e.target.value)}
        />
        <input
          type="text"
          placeholder="Assigned Person"
          value={newTaskAssignedPerson}
          onChange={(e) => setNewTaskAssignedPerson(e.target.value)}
        />
        <button onClick={handleCreateTask}>Create Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {editingTask && editingTask._id === task._id ? (
              <div>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
                <textarea
                  value={editingTask.taskDescription}
                  onChange={(e) => setEditingTask({ ...editingTask, taskDescription: e.target.value })}
                />
                <select
                  value={editingTask.state}
                  onChange={(e) => setEditingTask({ ...editingTask, state: e.target.value })}
                >
                  {workflowStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <select
                  value={editingTask.projectId}
                  onChange={(e) => setEditingTask({ ...editingTask, projectId: e.target.value })}
                >
                  <option value="">Select Project</option>
                  {allProjects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={editingTask.epic}
                  onChange={(e) => setEditingTask({ ...editingTask, epic: e.target.value })}
                />
                <input
                  type="text"
                  value={editingTask.sprint}
                  onChange={(e) => setEditingTask({ ...editingTask, sprint: e.target.value })}
                />
                <input
                  type="text"
                  value={editingTask.assignedPerson}
                  onChange={(e) => setEditingTask({ ...editingTask, assignedPerson: e.target.value })}
                />
                <button onClick={handleUpdateTask}>Update Task</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <div>
                Title: {task.title} - State: {task.state} - Project: {projectMap[task.projectId]} - Sprint: {task.sprint ? task.sprint : 'Backlog'} - Task Description: {task.taskDescription} - Assigned Person: {task.assignedPerson ? task.assignedPerson : 'Unassigned'}
                <button onClick={() => startEditingTask(task)}>Edit</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
