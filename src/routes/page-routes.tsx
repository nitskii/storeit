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
import LocationsPage from '../components/LocationsPage';
import LocationsPageContent from '../components/LocationsPageContent';

const pageRoutes = new Elysia({ name: 'pageRoutes' })
  .use(html())
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
    '/',
    ({ headers }) => (
      headers['hx-request']
        ? <IndexPageContent />
        : <IndexPage />
    )
  )
  .get(
    '/locations',
    ({ headers }) => (
      headers['hx-request']
        ? <LocationsPageContent />
        : <LocationsPage />
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
