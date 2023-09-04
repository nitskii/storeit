import { randomUUID } from 'crypto';
import { and, eq } from 'drizzle-orm';
import db from '../db';
import { NewLocation, locations, locationsToLocations } from '../db/schema';

const create = async (newLocation: NewLocation) => {
  const [ locationExists ] = await db
    .select({
      id: locations.id
    })
    .from(locations)
    .where(
      and(
        eq(locations.userId, newLocation.userId),
        eq(locations.name, newLocation.name)
      ))
    .limit(1);

  if (locationExists) {
    throw new Error('Location exists');
  }
  
  if (newLocation.parentId) {
    const [ existingParent ] = await db
      .select({
        id: locations.id
      })
      .from(locations)
      .where(
        and(
          eq(locations.userId, newLocation.userId),
          eq(locations.id, newLocation.parentId)
        ))
      .limit(1);
          
    if (!existingParent) {
      throw new Error('Parent location not found');
    }
  }

  const newLocationId = randomUUID();

  await db
    .insert(locations)
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
      id: locations.id,
      name: locations.name
    })
    .from(locations)
    .where(eq(locations.userId, userId));
};

const existsById = async (id: string) => {
  return (
    await db
      .select({
        id: locations.id
      })
      .from(locations)
      .where(eq(locations.id, id))
      .limit(1)
  ).length == 1;
};

export default {
  create,
  getAllForUser,
  existsById
};
