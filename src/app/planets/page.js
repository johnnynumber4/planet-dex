
'use client';

import { useState, useEffect } from 'react';

const PlanetsPage = () => {
  const [planets, setPlanets] = useState([]);
  const [newPlanet, setNewPlanet] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPlanets = async () => {
    setLoading(true);
    const response = await fetch('/api/planets');
    const data = await response.json();
    setPlanets(data.planets);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  const handleCreatePlanet = async () => {
    const response = await fetch('/api/planets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newPlanet,
      }),
    });

    if (response.ok) {
      setNewPlanet('');
      await fetchPlanets(); // Reload planets after submission
    }
  };

  return (
    <div>
      <h1>Planets</h1>
      <div>
        <input
          type="text"
          placeholder="Planet Name"
          value={newPlanet}
          onChange={(e) => setNewPlanet(e.target.value)}
        />
        <button onClick={handleCreatePlanet}>Create Planet</button>
      </div>
      {loading ? (
        <p>Loading planets...</p>
      ) : (
        <ul>
          {planets.map((planet) => (
            <li key={planet._id}>
              {planet.name || 'Unnamed Planet'}  {/* Fallback if `name` is missing */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlanetsPage;
