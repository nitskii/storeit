import Elysia, { t } from 'elysia';
import { authenticator } from '../plugins';
import searchService from '../services/search-service';

const searchRoutes = new Elysia({ name: 'searchRoutes' })
  .use(authenticator)
  .get(
    '/search',
    async ({ userId, query: { q: query } }) => {
      const result = await searchService.find({ userId, query });

      return result;
    }, {
      query: t.Object({
        q: t.String()
      })
    }
  );

export default searchRoutes;
