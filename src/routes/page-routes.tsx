import { html } from '@elysiajs/html';
import Elysia from 'elysia';
import {
  IndexPage,
  IndexPageContent,
  LoginPage,
  LoginPageContent,
  NotFoundPage,
  SignupPage,
  SignupPageContent
} from '../components';

const pageRoutes = new Elysia({ name: 'pageRoutes' })
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
  .get(
    '/*',
    ({ path, set }) => {
      set.status = 404;

      return path.startsWith('/api')
        ? { message: 'Endpoint not found' }
        : <NotFoundPage />;
    }
  );

export default pageRoutes;
