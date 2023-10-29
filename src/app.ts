import staticPlugin from '@elysiajs/static';
import Elysia from 'elysia';
import "./config/cloudinary";
import {
  logger,
  redirector
} from './plugins';
import {
  authRoutes,
  itemRoutes,
  locationRoutes,
  pageRoutes,
  searchRoutes,
  tagRoutes
} from './routes';

new Elysia()
  .use(logger)
  .use(redirector)
  .use(staticPlugin())
  .group(
    '/api',
    app => app
      .use(authRoutes)
      .use(locationRoutes)
      .use(tagRoutes)
      .use(itemRoutes)
      .use(searchRoutes)
  )
  .use(pageRoutes)
  .listen(process.env.PORT ?? 8080, ({ hostname, port }) => {
    console.log(`Server started at http://${hostname}:${port}`);
  });
