// src/services/taskService.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function getTasks() {
  const client = await clientPromise;
  const db = client.db('planet_dex_db');
  return db.collection('tasks').find({}).toArray();
}

export async function createTask(newTask) {
  const client = await clientPromise;
  const db = client.db('planet_dex_db');
  newTask.assignedPerson = newTask.assignedPerson || '';
  newTask.projectId = new ObjectId(newTask.projectId);
  newTask.createdAt = new Date();
  newTask.updatedAt = new Date();
  newTask.description = newTask.newTaskDescription || '';
  const result = await db.collection('tasks').insertOne(newTask);
  const createdTask = await db.collection('tasks').findOne({ _id: result.insertedId });
  return createdTask;
}

export async function updateTask(_id, updatedTask) {
  const client = await clientPromise;
  const db = client.db('planet_dex_db');
  updatedTask.updatedAt = new Date();
  return await db.collection('tasks').updateOne({ _id: new ObjectId(_id) }, { $set: updatedTask });
}

export async function deleteTask(_id) {
  const client = await clientPromise;
  const db = client.db('planet_dex_db');
  const deletedAt = new Date();
  await db.collection('tasks').updateOne({ _id: new ObjectId(_id) }, { $set: { deletedAt } });
}

export async function getTaskById(taskid) {
  console.log(taskid)
  const client = await clientPromise;
  const db = client.db('planet_dex_db');
  return await db.collection('tasks').findOne({ _id: new ObjectId(taskid) });
}