import { eq } from 'drizzle-orm';
import db from '../db';
import { tags as tagsTable } from '../db/schema';

const createMany = async (tags: string[], userId: string) => {
  await db
    .insert(tagsTable)
    .values(tags.map(tag => ({ name: tag, userId })))
    .onConflictDoNothing({
      target: tagsTable.name
    });
};

const getAllForUser = async (userId: string) => {
  return await db
    .select({
      name: tagsTable.name
    })
    .from(tagsTable)
    .where(eq(tagsTable.userId, userId));
};

export default {
  createMany,
  getAllForUser
};