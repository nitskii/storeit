import html from '@elysiajs/html';
import { Elysia, t } from 'elysia';
import locationService from '../services/location-service';
import { authenticator } from '../plugins';

const locationRoutes = (app: Elysia) => app
  .group('/api', app => app
    .use(authenticator)
    .use(html())
    .model({
      location: t.Object({
        name: t.String(),
        parentId: t.Optional(t.String())
      })
    })
    .post(
      '/location',
      async ({ body: newLocation, userId }) => {
        await locationService.create({
          ...newLocation,
          userId
        });

        return (
          <div id="location-result-message" class="flex items-center gap-2">
          Додано
            <img src='/public/checkmark.svg' width='16px' height='16px'/>
          </div>
        );
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
    .onError(({ error: { message }, set }) => {
      switch (message) {
      case 'Location not found':
      case 'Parent location not found':
        set.status = 404;
        break;
      case 'Location exists':
        set.status = 409;
        return (
          <div class='pl-3 pt-1 text-red-500'>
            Локація вже існує
          </div>
        );
      }
  
      return { message };
    })
  );

export default locationRoutes;
