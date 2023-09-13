import Elysia from 'elysia';

const pageRoutes = new Elysia()
  .get('/', () => Bun.file(`${process.env.VIEWS_DIR}index.html`))
  .get('/signup', () => Bun.file(`${process.env.VIEWS_DIR}signup.html`))
  .get('/login', () => Bun.file(`${process.env.VIEWS_DIR}login.html`))
  .get('/public/:file', ({ params: { file } }) => Bun.file(`./public/${file}`));

export default pageRoutes;
