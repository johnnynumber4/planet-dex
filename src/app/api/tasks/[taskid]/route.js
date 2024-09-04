import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getTaskById, updateTask } from '../../../services/taskService';

export async function GET(request, { params }) {
  const { taskid } = params;

  if (!ObjectId.isValid(taskid)) {
    return NextResponse.json({ message: 'Invalid task ID' }, { status: 400 });
  }

  try {
    const task = await getTaskById(taskid);

    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error('Error fetching task:', error); // Add detailed error logging
    return NextResponse.json({ message: 'Error fetching task', error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { taskid } = params;
  const updatedTask = await request.json();

  // Validate the updated task
  if (updatedTask.title && updatedTask.title.trim() === '') {
    return NextResponse.json({ message: 'Task title cannot be empty' }, { status: 400 });
  }

  if (!ObjectId.isValid(taskid)) {
    return NextResponse.json({ message: 'Invalid task ID' }, { status: 400 });
  }

  // Remove _id from updatedTask to avoid modifying the immutable field
  delete updatedTask._id;

  try {
    const result = await updateTask(taskid, updatedTask);

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task updated', task: { _id: taskid, ...updatedTask } });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating task', error }, { status: 500 });
  }
}
