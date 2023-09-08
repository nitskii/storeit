import cookie from '@elysiajs/cookie';
import jwt from '@elysiajs/jwt';
import Elysia from 'elysia';
import userService from '../services/user-service';

const redirector = (app: Elysia) => app
  .use(cookie())
  .use(
    jwt({
      secret: process.env.SECRET
    })
  )
  .onBeforeHandle(async ({ path, cookie, jwt, set }) => {
    if (['/', '/signup', '/login'].includes(path) && cookie.auth) {
      const payload = await jwt.verify(cookie.auth);
      
      if (payload && await userService.existsById(payload.sub!)) {
        set.redirect = '/items';
      }
    } else if (path == '/items' && cookie.auth) {
      const payload = await jwt.verify(cookie.auth);
      
      if (!payload || !await userService.existsById(payload.sub!)) {
        set.redirect = '/login';
      }
    } else if (path == '/items' && !cookie.auth){
      set.redirect = '/login';
    }
  });

export default redirector;
