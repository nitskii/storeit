import cookie from '@elysiajs/cookie';
import jwt from '@elysiajs/jwt';
import { Elysia } from 'elysia';

export default (app: Elysia) => app
  .use(cookie())
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
  })
  .onError(({ error, set }) => {
    switch (error.message) {
    case 'JWT is invalid or expired':
      set.status = 400;
      break;
    case 'Unauthorized':
      set.status = 401;
      break;
    }
  
    return {
      message: error.message
    };
  });
