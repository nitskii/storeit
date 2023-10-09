import staticPlugin from '@elysiajs/static';
import { v2 as cloudinary } from 'cloudinary';
import Elysia from 'elysia';
import {
  errorHandler,
  logger,
  redirector
} from './plugins';
import {
  authRoutes,
  itemRoutes,
  locationRoutes,
  pageRoutes,
  tagRoutes
} from './routes';
import searchRoutes from './routes/search-routes';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
  .use(errorHandler)
  .listen(process.env.PORT ?? 8080, ({ hostname, port }) => {
    console.log(`Server started at http://${hostname}:${port}`);
  });
