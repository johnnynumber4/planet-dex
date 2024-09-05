'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { workflowStates } from '../../constants/constants';
import Modal from 'react-modal'; // Import a modal library or your custom modal
import styles from './board.module.css';
import { Dialog, DialogActions, DialogContent, Button, Grid, Box, Typography } from '@mui/material';

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks'); // Use your API endpoint here
        const data = await response.json();
        const groupedTasks = workflowStates.reduce((acc, state) => {
          acc[state] = data.tasks.filter(task => task.state === state);
          return acc;
        }, {});
        setColumns(groupedTasks);
        setTasks(data.tasks); // Set the tasks state as well
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleUpdateTask = async (task) => {
    if (!task.title.trim()) {
      alert('Task title cannot be empty');
      return;
    }

    const response = await fetch(`/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    if (response.ok) {
      const updatedTask = await response.json();
      setTasks(tasks.map(t => (t._id === updatedTask._id ? updatedTask : t)));

      const updatedColumns = workflowStates.reduce((acc, state) => {
        acc[state] = tasks.filter(t => t.state === state);
        return acc;
      }, {});
      setColumns(updatedColumns);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = Array.from(columns[source.droppableId]);
    const destColumn = Array.from(columns[destination.droppableId]);
    const [movedTask] = sourceColumn.splice(source.index, 1);

    movedTask.state = destination.droppableId;

    if (source.droppableId === destination.droppableId) {
      sourceColumn.splice(destination.index, 0, movedTask);
      setColumns({
        ...columns,
        [source.droppableId]: sourceColumn,
      });
    } else {
      destColumn.splice(destination.index, 0, movedTask);
      setColumns({
        ...columns,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      });
    }

    handleUpdateTask(movedTask);
  };

  const handleTaskClick = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch task details');
      }
      
      const task = await response.json();
      setSelectedTask(task.task);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  };

  const handleSaveTask = async (updatedTask) => {
    await handleUpdateTask(updatedTask, updatedTask.state);
    setTasks(tasks.map(t => (t._id === updatedTask._id ? updatedTask : t)));
    setIsModalOpen(false);
  };

  const handleMouseDown = () => {
    setIsClick(true);
  };

  const handleMouseUp = (taskId) => {
    if (isClick) {
      handleTaskClick(taskId);
    }
    setIsClick(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.board}>
          {workflowStates.map((state) => {
            if (!columns[state]) {
              return null;
            }
            return (
              <Droppable key={state} droppableId={state}>
                {(provided) => (
                  <div
                    className={styles.column}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <h2>{state}</h2>
                    {columns[state]?.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <div
                            className={styles.task}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onMouseDown={handleMouseDown}
                            onMouseUp={() => handleMouseUp(task._id)}
                          >
                            {task.title}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* Modal for displaying task details */}
      {isModalOpen && selectedTask && (
        <>
          <div className={styles.modalOverlay} onClick={closeModal}></div>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Task Details"
            className={styles.modal}
          >
            <h2>{selectedTask.title}</h2>
            <p>State: {selectedTask.state || 'Unassigned'}</p>
            <p>Project: {selectedTask.project}</p>
            <p>Epic: {selectedTask.epic || 'Unassigned'}</p>
            <p>Sprint: {selectedTask.sprint || 'Unassigned'}</p>
            <p>Assigned To: {selectedTask.assignedPerson || 'Unassigned'}</p>
            <button onClick={closeModal}>Close</button>
          </Modal>
        </>
      )}
    </>
  );
};

export default Board;
