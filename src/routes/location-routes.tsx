import html from '@elysiajs/html';
import { Elysia, t } from 'elysia';
import authentication from '../middleware/authentication';
import locationService from '../services/location-service';

const locationRoutes = (app: Elysia) => app
  .group('/api', app => app
    .use(authentication)
    .use(html())
    .model({
      location: t.Object({
        name: t.String(),
        parentId: t.Optional(t.String())
      })
    })
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
    )
    .onError(({ error, set }) => {
      switch (error.message) {
      case 'Location not found':
      case 'Parent location not found':
        set.status = 404;
        break;
      case 'Location exists':
        set.status = 409;
        break;
      }
  
      return {
        message: error.message
      };
    })
  );

export default locationRoutes;
