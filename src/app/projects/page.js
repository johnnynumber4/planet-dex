'use client';
import React, { useState, useEffect } from 'react';
import styles from "./page.module.css";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState('');
  const [newProjectAssignedPerson, setNewProjectAssignedPerson] = useState('');
  const [planets, setPlanets] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState('');

  useEffect(() => {
    async function fetchProjects() {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data.projects);
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    async function fetchPlanets() {
      const response = await fetch('/api/planets');
      const data = await response.json();
      setPlanets(data.planets);
    }
    fetchPlanets();
  }, []);

  const handleCreateProject = async () => {
    if (!newProject.trim()) {
      alert('Project name cannot be empty');
      return;
    }

    if (!selectedPlanet) {
      alert('Please select a planet');
      return;
    }

    const project = {
      name: newProject,
      assignedPerson: newProjectAssignedPerson,
      planetId: selectedPlanet
    };

    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });

    if (response.ok) {
      const data = await response.json();
      setProjects([...projects, data.project]);
      setNewProject('');
      setNewProjectAssignedPerson('');
      setSelectedPlanet('');
    }
  };

  return (
    <div>
      <h1>Projects</h1>
      <div>
        <input
          type="text"
          placeholder="Project Name"
          value={newProject}
          onChange={(e) => setNewProject(e.target.value)}
        />
        <input
          type="text"
          placeholder="Assigned Person"
          value={newProjectAssignedPerson}
          onChange={(e) => setNewProjectAssignedPerson(e.target.value)}
        />
        <select
          value={selectedPlanet}
          onChange={(e) => setSelectedPlanet(e.target.value)}
        >
          <option value="">Select Planet</option>
          {planets.map((planet) => (
            <option key={planet._id} value={planet._id}>
              {planet.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreateProject}>Create Project</button>
      </div>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            {project.name} - {project.assignedPerson} (Planet: {project.planetId})
          </li>
        ))}
      </ul>
    </div>
  );
}
