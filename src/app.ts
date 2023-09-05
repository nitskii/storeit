import { v2 as cloudinary } from 'cloudinary';
import Elysia from 'elysia';
import { logger, redirector } from './middleware';
import { authRoutes, itemRoutes, locationRoutes } from './routes';
import tagRoutes from './routes/tag-routes';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const VIEWS_DIR = './src/views/';

new Elysia()
  .use(logger)
  .use(authRoutes)
  .use(redirector)
  .get('/', () => Bun.file(`${VIEWS_DIR}index.html`))
  .get('/items', () => Bun.file(`${VIEWS_DIR}items.html`))
  .get('/public/:file', ({ params: { file } }) => Bun.file(`./public/${file}`))
  .use(locationRoutes)
  .use(tagRoutes)
  .use(itemRoutes)
  .onError(({ code }) => {
    if (code === 'NOT_FOUND') {
      return Bun.file(`${VIEWS_DIR}404.html`);
    }
  })
  .listen(process.env.PORT ?? 8080, ({ hostname, port }) => {
    console.log(`Server started at http://${hostname}:${port}`);
  });
