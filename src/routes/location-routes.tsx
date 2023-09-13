import html from '@elysiajs/html';
import { Elysia, t } from 'elysia';
import { authenticator } from '../plugins';
import locationService from '../services/location-service';

const locationRoutes = new Elysia()
  .use(authenticator)
  .model({
    location: t.Object({
      name: t.String(),
      parentId: t.Optional(t.String())
    })
  })
  .use(html())
  .post(
    '/location',
    async ({ body: newLocation, userId, set }) => {
      await locationService.create({
        ...newLocation,
        userId
      });

      set.status = 204;
    }, {
      body: 'location'
    }
  )
  .get(
    '/root-locations',
    async ({ userId, set }) => {
      const locations = await locationService.getAllRootLocations(userId);

      set.headers['HX-Reswap'] = 'innerHTML';

      if (!locations.length) {
        return (
          <div class="py-1 text-center text-sm text-gray-600">
              Локації відсутні
          </div>
        );
      }

      return locations
        .map(({ name }) => (
          <li class="cursor-pointer border-b border-black p-2 last:border-none hover:bg-orange-300">
            {name}
          </li>)
        )
        .join('');
    }
  );

export default locationRoutes;
