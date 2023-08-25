import cookie from '@elysiajs/cookie';
import { v2 as cloudinary } from 'cloudinary';
import Elysia from 'elysia';
import logger from './plugins/logger.plugin';
import itemRoutes from './routes/item.routes';
import locationRoutes from './routes/location.routes';
import userRoutes from './routes/user.routes';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const VIEWS_DIR = './src/views/';

new Elysia()
  .use(logger)
  .use(cookie())
  .get('/', ({ cookie, set }) => {
    if (!cookie.auth) {
      return Bun.file(`${VIEWS_DIR}index.html`);
    }

    set.status = 302;
    set.redirect = '/items';
  })
  .get('/items', async ({ cookie, set }) => {
    if (cookie.auth) {
      return Bun.file(`${VIEWS_DIR}items.html`);
    }

    set.status = 302;
    set.redirect = '/';
  })
  .get('/public/:file', ({ params: { file } }) => Bun.file(`./public/${file}`))
  .use(userRoutes)
  .use(locationRoutes)
  .use(itemRoutes)
  .listen(process.env.PORT ?? 8080, ({ hostname, port }) => {
    console.log(`Server started at http://${hostname}:${port}`);
  });
