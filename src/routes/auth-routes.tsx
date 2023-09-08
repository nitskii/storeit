// eslint-disable-next-line no-unused-vars
import * as elements from 'typed-html';

import cookie from '@elysiajs/cookie';
import jwt from '@elysiajs/jwt';
import { Elysia, t } from 'elysia';
import userService from '../services/auth-service';

const authRoutes = (app: Elysia) => app
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
    .post(
      '/signup',
      async ({ body: credentials, jwt, setCookie, set }) => {
        const newUserId = await userService.signup(credentials);
        const token = await jwt.sign({ sub: newUserId });

        setCookie('auth', token);

        set.status = 204;
        set.headers['HX-Redirect'] = '/items';
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
        set.headers['HX-Redirect'] = '/items';
      }, {
        body: 'user'
      }
    )
    .post(
      '/logout',
      async ({ set }) => {
        set.status = 204;
        set.headers['Set-Cookie'] = 'auth=;Path=/;Expires=Thu, 01 Jan 1970 00:00:00 GMT';
        set.headers['HX-Redirect'] = '/login';
      }
    )
    .onError(({ error: { message }, set }) => {
      switch (message) {
      case 'Incorrect password':
        set.status = 401;
        break;
      case 'User not found':
        set.status = 404;
        break;
      case 'User exists':
        set.status = 409;
        set.headers['Content-Type']='text/html;charset=utf-8';
        return (
          <div class="pl-2 pt-1 text-red-500">
            Нікнейм вже існує
          </div>
        );
      }

      return { message };
    })
  );

export default authRoutes;
