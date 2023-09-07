import { eq } from 'drizzle-orm';
import db from '../db';
import { users } from '../db/schema';

const existsById = async (userId: string) => {
  const [ exists ] = await db
    .select({
      id: users.id
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return exists;
};

export default {
  existsById
};
