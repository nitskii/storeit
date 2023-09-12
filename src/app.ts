import { v2 as cloudinary } from 'cloudinary';
import Elysia from 'elysia';
import { errorHandler, logger, redirector } from './plugins';
import { authRoutes, itemRoutes, locationRoutes } from './routes';
import tagRoutes from './routes/tag-routes';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

process.env.VIEWS_DIR = './src/views/';

new Elysia()
  .use(logger)
  .use(authRoutes)
  .use(redirector)
  .get('/', () => Bun.file(`${process.env.VIEWS_DIR}index.html`))
  .get('/signup', () => Bun.file(`${process.env.VIEWS_DIR}signup.html`))
  .get('/login', () => Bun.file(`${process.env.VIEWS_DIR}login.html`))
  .get('/public/:file', ({ params: { file } }) => Bun.file(`./public/${file}`))
  .use(locationRoutes)
  .use(tagRoutes)
  .use(itemRoutes)
  .use(errorHandler)
  .listen(process.env.PORT ?? 8080, ({ hostname, port }) => {
    console.log(`Server started at http://${hostname}:${port}`);
  });
