import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';
import db from '../db';
import { users } from '../db/schema';
import { UserCredentials } from '../types';
import { HttpError } from '../utils';

const signup = async (credentials: UserCredentials) => {
  const existingUser = await db
    .query
    .users
    .findFirst({
      columns: { id: true },
      where: eq(users.nickname, credentials.nickname)
    });

  if (existingUser) {
    throw new HttpError('Користувач вже існує', "USER_ALREADY_EXISTS", 409);
  }

  const salt = randomBytes(8).toString('hex');
  
  credentials.password = await Bun.password.hash(
    `${credentials.password}${salt}`,
    'bcrypt'
  );

  const [{ newUserId }] = await db
    .insert(users)
    .values({
      ...credentials,
      salt
    })
    .returning({
      newUserId: users.id
    });

  return newUserId;
};

const login = async (credentials: UserCredentials) => {
  const existingUser = await db.query.users.findFirst({
    columns: {
      id: true,
      password: true,
      salt: true
    },
    where: eq(users.nickname, credentials.nickname)
  });

  if (!existingUser) {
    throw new HttpError('Користувача не знайдено', "USER_NOT_FOUND", 404);
  }

  const correctPassword = await Bun.password.verify(
    `${credentials.password}${existingUser.salt}`,
    existingUser.password,
    'bcrypt'
  );

  if (!correctPassword) {
    throw new HttpError('Невірний пароль', "INCORRECT_PASSWORD", 400);
  }

  return existingUser.id;
};

export default {
  signup,
  login
};
