import { v2 as cloudinary } from 'cloudinary';
import Elysia from 'elysia';
import { authentication, logger } from './middleware';
import { authRoutes, itemRoutes, locationRoutes } from './routes';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const VIEWS_DIR = './src/views/';

new Elysia()
  .use(logger)
  .get('/', () => Bun.file(`${VIEWS_DIR}index.html`))
  .get('/public/:file', ({ params: { file } }) => Bun.file(`./public/${file}`))
  .use(authRoutes)
  .use(authentication)
  .get('/items', () => Bun.file(`${VIEWS_DIR}items.html`))
  .use(locationRoutes)
  .use(itemRoutes)
  .listen(process.env.PORT ?? 8080, ({ hostname, port }) => {
    console.log(`Server started at http://${hostname}:${port}`);
  });
