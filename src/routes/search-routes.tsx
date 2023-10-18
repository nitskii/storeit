import Elysia, { t } from 'elysia';
import { authenticator } from '../plugins';
import searchService from '../services/search-service';

const searchRoutes = new Elysia({ name: 'searchRoutes' })
  .use(authenticator)
  .get(
    '/search',
    async ({ userId, query: { q: query } }) => {
      const result = await searchService.find({ userId, query });

      if (result.length) {
        return (
          <section
            id="items-container"
            class="grid grid-cols-1 gap-y-4 p-4 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-4">
            {result}
          </section>
        );
      }

      return (
        <section
          id="items-container"
          class="flex h-full items-center justify-center text-center text-6xl">
          Предметів не знайдено
        </section>
      );
    },
    {
      query: t.Object({
        q: t.String()
      })
    }
  );

export default searchRoutes;
