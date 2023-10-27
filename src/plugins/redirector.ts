import cookie from '@elysiajs/cookie';
import jwt from '@elysiajs/jwt';
import Elysia from 'elysia';
import userService from '../services/user-service';

const itemPathRegex = /^\/item\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

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

        return "";
      }
    } else if ((['/', '/locations'].includes(path) || itemPathRegex.test(path)) && cookie.auth) {
      const payload = await jwt.verify(cookie.auth);
      
      if (!payload || !await userService.existsById(payload.sub!)) {
        set.redirect = '/login';

        return "";
      }
    } else if ((['/', '/locations'].includes(path) || itemPathRegex.test(path)) && !cookie.auth) {
      set.redirect = '/login';

      return "";
    }
  });

export default redirector;
