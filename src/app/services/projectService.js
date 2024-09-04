// src/services/projectService.js
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function getProjects() {
  const client = await clientPromise;
  const db = client.db('planet_dex_db');
  return db.collection('projects').find({}).toArray();
}

export async function createProject(newProject) {
  const client = await clientPromise;
  const db = client.db('planet_dex_db');
  newProject.assignedPerson = newProject.assignedPerson || '';
  const result = await db.collection('projects').insertOne(newProject);
  const createdProject = await db.collection('projects').findOne({ _id: result.insertedId });
  return createdProject;
}

export async function updateProject(_id, updatedProject) {
  const client = await clientPromise;
  const db = client.db('planet_dex_db');
  await db.collection('projects').updateOne({ _id: new ObjectId(_id) }, { $set: updatedProject });
}

export async function deleteProject(_id) {
  const client = await clientPromise;
  const db = client.db('planet_dex_db');
  await db.collection('projects').deleteOne({ _id: new ObjectId(_id) });
}
