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
  .onBeforeHandle(async ({ request, cookie, jwt, set }) => {
    const { pathname: path } = new URL(request.url);

    if (path == '/' && cookie.auth) {
      const payload = await jwt.verify(cookie.auth);
          
      if (payload && await userService.existsById(payload.sub!)) {
        set.redirect = '/items';
      }
    } else if (path == '/items' && !cookie.auth) {
      set.redirect = '/';
    }
  });

export default redirector;
