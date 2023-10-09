import { eq } from 'drizzle-orm';
import db from '../db';
import { users } from '../db/schema';

const existsById = async (userId: string) => {
  const exists = await db.query.users.findFirst({
    columns: { id: true },
    where: eq(users.id, userId)
  });

  return Boolean(exists);
};

const existsByNickname = async (nickname: string) => {
  const exists = await db.query.users.findFirst({
    columns: { id: true },
    where: eq(users.nickname, nickname)
  });

  return Boolean(exists);
};

export default {
  existsById,
  existsByNickname
};
