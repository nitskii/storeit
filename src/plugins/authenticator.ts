import jwt from '@elysiajs/jwt';
import { Elysia } from 'elysia';
import { HttpError } from '../utils';

const authenticator = new Elysia({ name: 'authenticator' })
  .use(
    jwt({
      secret: process.env.SECRET
    })
  )
  .derive(
    async ({ cookie: { auth }, jwt }) => {
      if (!auth) {
        throw new HttpError("Не авторізовано", "UNAUTHORIZED", 401);
      }

      const payload = await jwt.verify(`${auth}`);

      if (!payload) {
        throw new HttpError("Термін дії токену закінчився", "JWT_EXPIRED", 401);
      }

      return { userId: payload.sub };
    }
  );
    
export default authenticator;
      