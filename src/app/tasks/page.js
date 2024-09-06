'use client';

import { useEffect, useState } from 'react';
import { workflowStates } from '../../constants/constants';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Box, Container, Typography } from '@mui/material';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskState, setNewTaskState] = useState(workflowStates[0]);
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
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Task Management
        </Typography>
        <TextField
          label="New Task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="State"
          value={newTaskState}
          onChange={(e) => setNewTaskState(e.target.value)}
          fullWidth
          margin="normal"
        >
          {workflowStates.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            // Handle add task logic here
          }}
          sx={{ mt: 2 }}
        >
          Add Task
        </Button>
      </Box>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editingTask && editingTask.id === task.id ? (
              <div>
                <TextField
                  label="Edit Task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  select
                  label="State"
                  value={newTaskState}
                  onChange={(e) => setNewTaskState(e.target.value)}
                  fullWidth
                  margin="normal"
                >
                  {workflowStates.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    // Handle save task logic here
                  }}
                  sx={{ mt: 2, mr: 2 }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={cancelEditing}
                  sx={{ mt: 2 }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div>
                Title: {task.title} - State: {task.state} - Project: {projectMap[task.projectId]} - Sprint: {task.sprint ? task.sprint : 'Backlog'} - Task Description: {task.taskDescription} - Assigned Person: {task.assignedPerson ? task.assignedPerson : 'Unassigned'}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => startEditingTask(task)}
                  sx={{ ml: 2 }}
                >
                  Edit
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </Container>
  );
}
