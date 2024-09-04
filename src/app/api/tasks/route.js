import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { createTask, updateTask, getTasks } from '../../services/taskService';

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json({ tasks });
}

export async function POST(request) {
  const newTask = await request.json();

  // Validate the new task
  if (!newTask || !newTask.title || newTask.title.trim() === '') {
    return NextResponse.json({ message: 'Task title cannot be empty' }, { status: 400 });
  }

  if (!newTask.projectId || newTask.projectId.trim() === '') {
    return NextResponse.json({ message: 'Project is required' }, { status: 400 });
  }

  // Set default values
  newTask.state = newTask.state || 'todo';
  newTask.sprint = newTask.sprint || null;
  newTask.assignedPerson = newTask.assignedPerson || null;

  const createdTask = await createTask(newTask);
  return NextResponse.json({ message: 'Task created', task: createdTask });
}

export async function PUT(request) {
  const { _id, ...updatedTask } = await request.json();


  // Validate the updated task
  if (updatedTask.title && updatedTask.title.trim() === '') {
    return NextResponse.json({ message: 'Task title cannot be empty' }, { status: 400 });
  }

  if (!ObjectId.isValid(_id)) {
    return NextResponse.json({ message: 'Invalid task ID' }, { status: 400 });
  }

  try {
    const result = await updateTask(_id, updatedTask);

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task updated', task: { _id, ...updatedTask } });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating task', error }, { status: 500 });
  }
}
