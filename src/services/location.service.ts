import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import db from '../db';
import { locations } from '../db/schema';

const create = async (location: { name: string, parentId?: string }) => {
  const locationExists = (
    await db
      .select({
        id: locations.id
      })
      .from(locations)
      .where(eq(locations.name, location.name))
      .limit(1)
      .all()
  ).length > 0;

  if (locationExists) {
    throw new Error('Location exists');
  }

  const newLocationId = randomUUID();

  await db
    .insert(locations)
    .values({
      id: newLocationId,
      ...location
    })
    .run();

  return newLocationId;
};

export default {
  create
};