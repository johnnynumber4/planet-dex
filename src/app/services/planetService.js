import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Fetch all planets
export async function getPlanets() {
  try {
    const client = await clientPromise;
    const db = client.db('planet_dex_db');
    const planets = await db.collection('planets').find({}).toArray();
    return planets;
  } catch (error) {
    console.error('Error fetching planets:', error);
    return [];
  }
}

// Create a new planet
export async function createPlanet(newPlanet) {
  try {
    const client = await clientPromise;
    const db = client.db('planet_dex_db');
    const result = await db.collection('planets').insertOne(newPlanet);

    // Fetch the newly created planet
    const createdPlanet = await db.collection('planets').findOne({ _id: result.insertedId });
    return createdPlanet;
  } catch (error) {
    console.error('Error creating planet:', error);
    return null;
  }
}

// Update an existing planet
export async function updatePlanet(_id, updatedPlanet) {
  try {
    const client = await clientPromise;
    const db = client.db('planet_dex_db');

    // Update the planet
    const result = await db.collection('planets').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updatedPlanet }
    );

    if (result.matchedCount === 0) {
      console.error('No planet found with the provided ID');
      return null;
    }

    // Fetch the updated planet
    const updatedPlanetData = await db.collection('planets').findOne({ _id: new ObjectId(_id) });
    return updatedPlanetData;
  } catch (error) {
    console.error('Error updating planet:', error);
    return null;
  }
}

// Delete a planet
export async function deletePlanet(_id) {
  try {
    const client = await clientPromise;
    const db = client.db('planet_dex_db');
    const result = await db.collection('planets').deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      console.error('No planet found with the provided ID');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting planet:', error);
    return false;
  }
}
