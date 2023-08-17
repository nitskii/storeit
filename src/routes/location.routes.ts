import { Elysia, t } from 'elysia';
import authPlugin from '../plugins/auth.plugin';
import locationService from '../services/location.service';

const locationRoutes = (app: Elysia) => app
  .use(authPlugin)
  .model({
    'location': t.Object({
      name: t.String(),
      parentId: t.Optional(t.String())
    })
  })
  .post(
    '/location',
    async ({ body: newLocation, set }) => {
      await locationService.create(newLocation);

      set.status = 204;
    },
    { body: 'location' }
  );

export default locationRoutes;