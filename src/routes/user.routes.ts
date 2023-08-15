import cookie from '@elysiajs/cookie';
import jwt from '@elysiajs/jwt';
import { Elysia, t } from 'elysia';
import userService from '../services/user.service';

const userRoutes = (app: Elysia) => app
  .use(cookie({
    maxAge: process.env.COOKIE_MAX_AGE,
    sameSite: true
  }))
  .use(
    jwt({
      secret: process.env.SECRET
    })
  )
  .model({
    user: t.Object({
      nickname: t.String({
        minLength: 3,
        maxLength: 30,
      }),
      password: t.String({
        minLength: 8,
        maxLength: 50
      })
    })
  })
  .post(
    '/signup',
    async ({ body: userData, jwt, setCookie, set }) => {
      const newUserId = await userService.signup(userData);
      const token = await jwt.sign({ sub: newUserId });

      setCookie('auth', token);

      set.status = 204;
      set.headers['HX-Redirect'] = '/items';
            
      return;
    },
    { body: 'user' }
  )
  .post(
    '/login',
    async ({ body: userData, jwt, setCookie, set }) => {
      const userId = await userService.login(userData);
      const token = await jwt.sign({ sub: userId });

      setCookie('auth', token);

      set.status = 204;
      set.headers['HX-Redirect'] = '/items';
            
      return;
    },
    { body: 'user' }
  )
  .post(
    '/logout',
    async ({ set }) => {
      set.status = 204;
      set.headers['Set-Cookie'] = 'auth=;Path=/;Expires=Thu, 01 Jan 1970 00:00:00 GMT';
      set.headers['HX-Redirect'] = '/';
    }
  );
  

export default userRoutes;