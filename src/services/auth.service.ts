import { randomBytes, randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import db from '../db';
import { users } from '../db/schema';
import { UserCredentials } from '../types/user.types';

const signup = async (newUser: UserCredentials) => {
  const [ existingUser ] = await db
    .select({
      id: users.id
    })
    .from(users)
    .where(eq(users.nickname, newUser.nickname))
    .limit(1)
    .all();

  if (existingUser) {
    throw new Error('User exists');
  }

  const salt = randomBytes(8).toString('hex');
  
  newUser.password = await Bun.password.hash(
    `${newUser.password}${salt}`,
    'bcrypt'
  );

  const newUserId = randomUUID();

  await db
    .insert(users)
    .values({
      id: newUserId,
      ...newUser,
      salt
    })
    .run();

  return newUserId;
};

const login = async (user: UserCredentials) => {
  const [ existingUser ] = await db
    .select({
      id: users.id,
      password: users.password,
      salt: users.salt
    })
    .from(users)
    .where(eq(users.nickname, user.nickname))
    .limit(1)
    .all();

  if (!existingUser) {
    throw new Error('User not found');
  }

  const correctPassword = await Bun.password.verify(
    `${user.password}${existingUser.salt}`,
    existingUser.password,
    'bcrypt'
  );

  if (!correctPassword) {
    throw new Error('Incorrect password');
  }

  return existingUser.id;
};

export default {
  signup,
  login
};
