import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';
import db from '../db';
import { UserCredentials, users } from '../db/schema';

const signup = async (credentials: UserCredentials) => {
  const [ existingUser ] = await db
    .select({
      id: users.id
    })
    .from(users)
    .where(eq(users.nickname, credentials.nickname))
    .limit(1);

  if (existingUser) {
    throw new Error('User exists');
  }

  const salt = randomBytes(8).toString('hex');
  
  credentials.password = await Bun.password.hash(
    `${credentials.password}${salt}`,
    'bcrypt'
  );

  const [ newUser ] = await db
    .insert(users)
    .values({
      ...credentials,
      salt
    })
    .returning();

  return newUser.id;
};

const login = async (credentials: UserCredentials) => {
  const [ existingUser ] = await db
    .select({
      id: users.id,
      password: users.password,
      salt: users.salt
    })
    .from(users)
    .where(eq(users.nickname, credentials.nickname))
    .limit(1);

  if (!existingUser) {
    throw new Error('User not found');
  }

  const correctPassword = await Bun.password.verify(
    `${credentials.password}${existingUser.salt}`,
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
