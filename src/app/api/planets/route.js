import { NextResponse } from 'next/server';
import { getPlanets, createPlanet, deletePlanet } from '../../services/planetService';

export async function GET() {
  const planets = await getPlanets();
  return NextResponse.json({ planets });
}

export async function POST(request) {
  const newPlanet = await request.json();

  if (!newPlanet || !newPlanet.name || newPlanet.name.trim() === '') {
    return NextResponse.json({ message: 'Planet name cannot be empty' }, { status: 400 });
  }

  const createdPlanet = await createPlanet(newPlanet);
  return NextResponse.json({ message: 'Planet created', project: createdPlanet });
}

export async function DELETE(request) {
  const { _id } = await request.json();
  await deletePlanet(_id);
  return NextResponse.json({ message: 'Planet deleted' });
}
