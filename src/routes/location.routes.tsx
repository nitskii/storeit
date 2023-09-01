// eslint-disable-next-line no-unused-vars
import * as elements from 'typed-html';

import { Elysia, t } from 'elysia';
import authentication from '../middleware/authentication';
import locationService from '../services/location.service';

const locationRoutes = (app: Elysia) => app
  .group('/api', app => app
    .use(authentication)
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
      },
      { body: 'location' }
    )
    .get(
      '/locations',
      async ({ userId }) => {
        const locations = await locationService.getAllForUser(userId);

        return locations
          .map(({ id, name }) => <option value={id}>{name}</option>)
          .join();
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