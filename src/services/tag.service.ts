import { randomUUID } from 'crypto';
import db from '../db';
import { tags as tagsTable } from '../db/schema';

const createMany = async (tags: string[]) => {
  await db
    .insert(tagsTable)
    .values(tags.map(tag => ({
      id: randomUUID(),
      name: tag
    })))
    .onConflictDoNothing({
      target: tagsTable.name
    })
    .run();
};

export default {
  createMany
};