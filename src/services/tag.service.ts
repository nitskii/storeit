import db from '../db';
import { tags as tagsTable } from '../db/schema';

const createMany = async (tags: string[]) => {
  await db
    .insert(tagsTable)
    .values(tags.map(tag => ({ name: tag })))
    .onConflictDoNothing({
      target: tagsTable.name
    });
};

export default {
  createMany
};