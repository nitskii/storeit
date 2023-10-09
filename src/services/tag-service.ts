import { eq, inArray } from 'drizzle-orm';
import db from '../db';
import { tags } from '../db/schema';

const createMany = async (tagNames: string[], userId: string) => {
  await db
    .insert(tags)
    .values(tagNames.map(name => ({ name, userId })))
    .onConflictDoNothing();

  const tagIds = await db.query.tags.findMany({
    columns: { id: true },
    where: inArray(tags.name, tagNames)
  });

  return tagIds;
};

const getAllForUser = async (userId: string) => {
  const tagNames = await db.query.tags.findMany({
    columns: { name: true },
    where: eq(tags.userId, userId)
  });

  return tagNames;
};

export default {
  createMany,
  getAllForUser
};
