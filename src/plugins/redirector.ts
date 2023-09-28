import cookie from '@elysiajs/cookie';
import jwt from '@elysiajs/jwt';
import Elysia from 'elysia';
import userService from '../services/user-service';

const redirector = new Elysia({ name: 'redirector' })
  .use(cookie())
  .use(
    jwt({
      secret: process.env.SECRET
    })
  )
  .onBeforeHandle(async ({ path, cookie, jwt, set }) => {
    if (['/signup', '/login'].includes(path) && cookie.auth) {
      const payload = await jwt.verify(cookie.auth);
      
      if (payload && await userService.existsById(payload.sub!)) {
        set.redirect = '/';

        return '';
      }
    } else if (path == '/' && cookie.auth) {
      const payload = await jwt.verify(cookie.auth);
      
      if (!payload || !await userService.existsById(payload.sub!)) {
        set.redirect = '/login';

        return '';
      }
    } else if (path == '/' && !cookie.auth){
      set.redirect = '/login';

      return '';
    }
  });

export default redirector;
