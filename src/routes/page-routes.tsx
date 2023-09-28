import { html } from '@elysiajs/html';
import Elysia from 'elysia';
import { IndexPage, IndexPageContent, LoginPage, LoginPageContent, NotFoundPage, SignupPage, SignupPageContent } from '../components';

const pageRoutes = new Elysia()
  .use(html())
  .get(
    '/',
    ({ headers }) => (
      headers['hx-request']
        ? <IndexPageContent />
        : <IndexPage />
    )
  )
  .get(
    '/signup',
    ({ headers }) => (
      headers['hx-request']
        ? <SignupPageContent />
        : <SignupPage />
    )
  )
  .get(
    '/login',
    ({ headers }) => (
      headers['hx-request']
        ? <LoginPageContent />
        : <LoginPage />
    )
  )
  .get('/public/:file', ({ params: { file } }) => Bun.file(`./public/${file}`))
  .get(
    '/*',
    ({ path }) => (
      path.startsWith('/api')
        ? { message: 'Endpoint not found' }
        : <NotFoundPage />
    )
  );

export default pageRoutes;
