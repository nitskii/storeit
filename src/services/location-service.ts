import { and, eq, notInArray } from 'drizzle-orm';
import db from '../db';
import { NewLocation, locations, locationsToLocations } from '../db/schema';

const create = async (newLocation: NewLocation) => {
  const [ existingLocation ] = await db
    .select({
      id: locations.id
    })
    .from(locations)
    .where(
      and(
        eq(locations.name, newLocation.name),
        eq(locations.userId, newLocation.userId)
      ))
    .limit(1);

  const { parentId: hasParent } = newLocation;

  if (!existingLocation && !hasParent) {
    await db
      .insert(locations)
      .values({
        ...newLocation
      });
  } else if (!existingLocation && hasParent) {
    const [ existingParent ] = await db
      .select({
        id: locations.id
      })
      .from(locations)
      .where(
        and(
          eq(locations.userId, newLocation.userId),
          eq(locations.id, newLocation.parentId!)
        ))
      .limit(1);
          
    if (!existingParent) {
      throw new Error('Parent location not found');
    }

    const [{ id: newLocationId }] = await db
      .insert(locations)
      .values({
        ...newLocation
      })
      .returning({
        id: locations.id
      });

    if (newLocation.parentId) {
      await db
        .insert(locationsToLocations)
        .values({
          parentId: newLocation.parentId,
          childId: newLocationId
        });
    }
  } else if (existingLocation && !hasParent) {
    throw new Error('Location exists');
  } else {
    const [ recordExists ] = await db
      .select()
      .from(locationsToLocations)
      .where(and(
        eq(locationsToLocations.parentId, newLocation.parentId!),
        eq(locationsToLocations.childId, existingLocation.id)
      ))
      .limit(1);

    if (recordExists) {
      throw new Error('Parent location already has such child');
    }

    await db
      .insert(locationsToLocations)
      .values({
        parentId: newLocation.parentId!,
        childId: existingLocation.id
      });
  }
};

const getAllRootLocations = async (userId: string) => {
  const childIds = (
    await db
      .select({
        id: locationsToLocations.childId
      })
      .from(locationsToLocations)
  ).map(r => r.id);

  const rootLocations = await db
    .select({
      name: locations.name
    })
    .from(locations)
    .where(
      and(
        eq(locations.userId, userId),
        notInArray(locations.id, childIds.length ? childIds : [''])
      )
    );

  return rootLocations;
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
  getAllRootLocations,
  existsById
};
