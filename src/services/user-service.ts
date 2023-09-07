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

  return Boolean(exists);
};

const existsByNickname = async (nickname: string) => {
  const [ exists ] = await db
    .select({
      id: users.id
    })
    .from(users)
    .where(eq(users.nickname, nickname))
    .limit(1);

  return Boolean(exists);
};

export default {
  existsById,
  existsByNickname
};
