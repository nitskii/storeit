import { html } from '@elysiajs/html';
import { Elysia, t } from 'elysia';
import { authenticator } from '../plugins';
import itemService from '../services/item-service';
import { mapItemsToHTML } from '../utils';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const itemRoutes = (app: Elysia) =>
  app
    .use(authenticator)
    .use(html())
    .model({
      item: t.Object({
        name: t.String(),
        image: t.File({
          // currently has a bug which doesn't allow to upload .webp and some other formats
          // type: 'image',
          maxSize: MAX_IMAGE_SIZE
        }),
        locationId: t.Optional(t.String()),
        tags: t.Optional(t.Union([t.Array(t.String()), t.String()]))
      })
    })
    .post(
      '/item',
      async ({ body: newItem, userId, set }) => {
        await itemService.create({
          ...newItem,
          tags: typeof newItem.tags == 'string' ? [newItem.tags] : newItem.tags,
          userId
        });

        set.status = 204;
        set.headers['HX-Trigger'] = 'itemsUpdate';
      },
      {
        body: 'item'
      }
    )
    .get('/items', async ({ userId }) => {
      const items = await itemService.getAllForUser(userId);

      return mapItemsToHTML(items);
    })
    .get('/item/:itemId', async ({ userId, params: { itemId } }) => {
      const item = await itemService.getOneForUser(userId, itemId);

      return item;
    });

export default itemRoutes;
