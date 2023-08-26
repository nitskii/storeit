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
    const [ existingParent ] = await db
      .select({
        id: locations.id
      })
      .from(locations)
      .where(eq(locations.name, newLocation.parent))
      .limit(1)
      .all();

    if (!existingParent) {
      throw new Error('Parent location not found');
    }
    
    parentId = existingParent.id;
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