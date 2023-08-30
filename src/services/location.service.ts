import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import db from '../db';
import { NewLocation, locations as locationsTable, locationsToLocations } from '../db/schema';

const create = async (newLocation: NewLocation) => {
  const [ locationExists ] = await db
    .select({
      id: locationsTable.id
    })
    .from(locationsTable)
    .where(
      and(
        eq(locationsTable.userId, newLocation.userId),
        eq(locationsTable.name, newLocation.name)
      ))
    .limit(1);

  if (locationExists) {
    throw new Error('Location exists');
  }
  
  if (newLocation.parentId) {
    const [ existingParent ] = await db
      .select({
        id: locationsTable.id
      })
      .from(locationsTable)
      .where(
        and(
          eq(locationsTable.userId, newLocation.userId),
          eq(locationsTable.id, newLocation.parentId)
        ))
      .limit(1);
          
    if (!existingParent) {
      throw new Error('Parent location not found');
    }
  }

  const newLocationId = randomUUID();

  await db
    .insert(locationsTable)
    .values({
      id: newLocationId,
      ...newLocation
    });

  if (newLocation.parentId) {
    await db
      .insert(locationsToLocations)
      .values({
        parentId: newLocation.parentId,
        childId: newLocationId
      });
  }
};

const getAllForUser = async (userId: string) => {
  return await db
    .select({
      id: locationsTable.id,
      name: locationsTable.name
    })
    .from(locationsTable)
    .where(eq(locationsTable.userId, userId))
    .all();  
};

const getIdByName = async (name: string): Promise<string | null> => {
  const [ location ] = await db
    .select({
      id: locationsTable.id
    })
    .from(locationsTable)
    .where(eq(locationsTable.name, name))
    .limit(1)
    .all();
    
  return location ? location.id : null;
};

export default {
  create,
  getIdByName,
  getAllForUser
};