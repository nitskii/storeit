import {
  and,
  eq,
  inArray,
  notInArray
} from 'drizzle-orm';
import db from '../db';
import {
  locations,
  locationsToLocations
} from '../db/schema';
import {
  LocationBase,
  LocationWithChildren,
  NewLocation
} from '../types';
import { HttpError } from '../utils';

const create = async (newLocation: NewLocation) => {
  const existingLocation = await db
    .query
    .locations
    .findFirst({
      columns: { id: true },
      where: and(
        eq(locations.name, newLocation.name),
        eq(locations.userId, newLocation.userId)
      )
    });

  if (!existingLocation && !newLocation.parentId) {
    await db
      .insert(locations)
      .values(newLocation);
  } else if (!existingLocation && newLocation.parentId) {
    const existingParent = await db
      .query
      .locations
      .findFirst({
        columns: { id: true },
        where: and(
          eq(locations.userId, newLocation.userId),
          eq(locations.id, newLocation.parentId!)
        )
      });

    if (!existingParent) {
      throw new HttpError(
        'Локацію не знайдено',
        'LOCATION_NOT_FOUND',
        404
      );
    }

    const [{ newLocationId }] = await db
      .insert(locations)
      .values(newLocation)
      .returning({ newLocationId: locations.id });

    if (newLocation.parentId) {
      await db
        .insert(locationsToLocations)
        .values({
          parentId: newLocation.parentId,
          childId: newLocationId
        });
    }
  } else if (existingLocation && !newLocation.parentId) {
    throw new HttpError(
      'Локація вже існує',
      'LOCATION_ALREADY_EXISTS',
      409
    );
  } else if (existingLocation && newLocation.parentId) {
    if (existingLocation.id == newLocation.parentId) {
      throw new HttpError(
        'Локація не може належити сама до себе',
        'LOCATION_SELF_REFERENCE',
        400
      );
    }

    const recordExists = await db
      .query
      .locationsToLocations
      .findFirst({
        where: and(
          eq(locationsToLocations.parentId, newLocation.parentId),
          eq(locationsToLocations.childId, existingLocation.id)
        )
      });

    if (recordExists) {
      throw new HttpError(
        'Локація вже існує',
        'LOCATION_ALREADY_EXISTS',
        409
      );
    }

    await db
      .insert(locationsToLocations)
      .values({
        parentId: newLocation.parentId,
        childId: existingLocation.id
      });
  }
};

const getAllRootLocations = async (userId: string) => {
  const parentsChildren = await db
    .query
    .locationsToLocations
    .findMany();

  const childIds = parentsChildren.map((r) => r.childId);

  const rootLocations = await db
    .query
    .locations
    .findMany({
      columns: {
        id: true,
        name: true
      },
      where: and(
        eq(locations.userId, userId),
        notInArray(locations.id, childIds)
      )
    }) as { id: string; name: string; hasChildren: boolean }[];

  const parentIds = parentsChildren.map((r) => r.parentId);

  rootLocations
    .forEach(
      (l) => l.hasChildren = parentIds.includes(l.id)
    );

  return rootLocations;
};

const existsById = async ({ userId, locationId }: LocationBase) => {
  const exists = await db
    .query
    .locations
    .findFirst({
      columns: { id: true },
      where: and(
        eq(locations.userId, userId),
        eq(locations.id, locationId)
      )
    });

  return Boolean(exists);
};

const getChildrenById = async (parentId: string) => {
  const childIds = (
    await db
      .query
      .locationsToLocations
      .findMany({
        columns: { childId: true },
        where: eq(locationsToLocations.parentId, parentId)
      })
  ).map((row) => row.childId);

  const children = await db
    .query
    .locations
    .findMany({
      columns: { id: true, name: true },
      where: inArray(locations.id, childIds)
    }) as { id: string; name: string; hasChildren: boolean }[];

  const parentIds = (
    await db
      .query
      .locationsToLocations
      .findMany({
        columns: { parentId: true }
      })
  ).map((r) => r.parentId);

  children
    .forEach(
      (c) => c.hasChildren = parentIds.includes(c.id)
    );

  return children;
};

const getChildrenByIdRecursively = async (parentId: string): Promise<LocationWithChildren[]> => {
  const childIds = (
    await db
      .query
      .locationsToLocations
      .findMany({
        columns: { childId: true },
        where: eq(locationsToLocations.parentId, parentId)
      })
  ).map((row) => row.childId);

  const children = await db
    .query
    .locations
    .findMany({
      columns: { id: true, name: true },
      where: inArray(locations.id, childIds)
    });

  const parentIds = (
    await db
      .query
      .locationsToLocations
      .findMany({
        columns: { parentId: true }
      })
  ).map((r) => r.parentId);

  return await Promise.all(
    children.map(async (c) => ({
      ...c,
      children: parentIds.includes(c.id)
        ? await getChildrenByIdRecursively(c.id)
        : []
    }))
  );
};

const getAllLocations = async (userId: string) => {
  const rootLocations = await getAllRootLocations(userId);

  const result = await Promise.all(
    rootLocations.map(async (rl) => ({
      id: rl.id,
      name: rl.name,
      children: rl.hasChildren
        ? await getChildrenByIdRecursively(rl.id)
        : []
    }))
  );

  return result;
};

export default {
  create,
  getAllRootLocations,
  existsById,
  getChildrenById,
  getAllLocations
};
