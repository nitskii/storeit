import cookie from '@elysiajs/cookie';
import html from '@elysiajs/html';
import jwt from '@elysiajs/jwt';
import { Elysia, t } from 'elysia';
import userService from '../services/auth-service';

const authRoutes = new Elysia()
  .group('/api', app => app
    .use(cookie({
      maxAge: process.env.COOKIE_MAX_AGE,
      sameSite: true
    }))
    .use(jwt({
      secret: process.env.SECRET
    }))
    .model({
      user: t.Object({
        nickname: t.String({
          minLength: 3,
          maxLength: 30
        }),
        password: t.String({
          minLength: 8,
          maxLength: 50
        })
      })
    })
    .use(html())
    .post(
      '/signup',
      async ({ body: credentials, jwt, setCookie, set }) => {
        const newUserId = await userService.signup(credentials);
        const token = await jwt.sign({ sub: newUserId });

        setCookie('auth', token);

        set.status = 204;
        set.headers['HX-Redirect'] = '/';
      }, {
        body: 'user'
      }
    )
    .post(
      '/login',
      async ({ body: credentials, jwt, setCookie, set }) => {
        const userId = await userService.login(credentials);
        const token = await jwt.sign({ sub: userId });

        setCookie('auth', token);

        set.status = 204;
        set.headers['HX-Redirect'] = '/';
      }, {
        body: 'user'
      }
    )
    .post(
      '/logout',
      async ({ set }) => {
        set.status = 204;
        set.headers['Set-Cookie'] = 'auth=;Path=/;Expires=Thu, 01 Jan 1970 00:00:00 GMT;SameSite=Strict';
        set.headers['HX-Redirect'] = '/login';
      }
    )
  );

export default authRoutes;
