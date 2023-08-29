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

  if (newLocation.parentId) {
    const [ existingParent ] = await db
      .select({
        id: locations.id
      })
      .from(locations)
      .where(eq(locations.id, newLocation.parentId))
      .limit(1)
      .all();

    if (!existingParent) {
      throw new Error('Parent location not found');
    }
  }

  await db
    .insert(locations)
    .values({
      id: randomUUID(),
      ...newLocation
    })
    .run();
};

const getIdByName = async (name: string): Promise<string | null> => {
  const [ location ] = await db
    .select({
      id: locations.id
    })
    .from(locations)
    .where(eq(locations.name, name))
    .limit(1)
    .all();
    
  return location ? location.id : null;
};

export default {
  create,
  getIdByName
};