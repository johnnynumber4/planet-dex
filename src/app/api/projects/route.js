import { NextResponse } from 'next/server';
import { getProjects, createProject, deleteProject } from '../../services/projectService';

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json({ projects });
}

export async function POST(request) {
  const newProject = await request.json();

  // Validate the new project
  if (!newProject || !newProject.name || newProject.name.trim() === '') {
    return NextResponse.json({ message: 'Project name cannot be empty' }, { status: 400 });
  }

  // Set default values
  newProject.assignedPerson = newProject.assignedPerson || null;

  const createdProject = await createProject(newProject);
  return NextResponse.json({ message: 'Project created', project: createdProject });
}

export async function DELETE(request) {
  const { _id } = await request.json();
  await deleteProject(_id);
  return NextResponse.json({ message: 'Project deleted' });
}
