import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import db from '../db';
import { locations } from '../db/schema';
import { NewLocation } from '../types/location.types';

const create = async (newLocation: NewLocation) => {
  const [ locationExists ] = await db
    .select({
      id: locations.id
    })
    .from(locations)
    .where(eq(locations.name, newLocation.name))
    .limit(1)
    .all();

  if (locationExists) {
    throw new Error('Location exists');
  }

  let parentId = null;

  if (newLocation.parent) {
    const [ existingLocation ] = await db
      .select({
        id: locations.id
      })
      .from(locations)
      .where(eq(locations.name, newLocation.name))
      .limit(1)
      .all();

    if (!existingLocation) {
      throw new Error('Location not found');
    }
    
    parentId = existingLocation.id;
  }

  await db
    .insert(locations)
    .values({
      id: randomUUID(),
      name: newLocation.name,
      parentId
    })
    .run();
};

export default {
  create
};