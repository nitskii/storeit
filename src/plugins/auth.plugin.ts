import cookie from '@elysiajs/cookie';
import jwt from '@elysiajs/jwt';
import Elysia from 'elysia';

const authPlugin = new Elysia()
  .use(
    cookie({
      maxAge: process.env.COOKIE_MAX_AGE,
      sameSite: true
    })
  )
  .use(
    jwt({
      secret: process.env.SECRET
    })
  )
  .derive(async ({ cookie, jwt }) => {
    if (!cookie.auth) {
      throw new Error('Unauthorized');
    }

    const payload = await jwt.verify(cookie.auth);

    if (!payload) {
      throw new Error('JWT is invalid or expired');
    }

    return {
      userId: payload.sub!
    };
  });

export default authPlugin;