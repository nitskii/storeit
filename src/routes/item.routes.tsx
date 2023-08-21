import { Elysia, t } from 'elysia';
// eslint-disable-next-line no-unused-vars
import * as elements from 'typed-html';
import authPlugin from '../plugins/auth.plugin';
import itemService from '../services/item.service';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const itemRoutes = (app: Elysia) =>
  app
    .use(authPlugin)
    .model({
      item: t.Object({
        name: t.String(),
        image: t.File({
          type: 'image',
          maxSize: MAX_IMAGE_SIZE
        }),
        location: t.String(),
        tags: t.Optional(t.Union([t.Array(t.String()), t.String()]))
      })
    })
    .get('/item/locations', async ({ userId }) => {
      return await itemService.getItemLocations(userId);
    })
    .post(
      '/item',
      async ({ body: newItem, userId }) => {
        await itemService.create({
          ...newItem,
          tags: typeof newItem.tags == 'string' ? [newItem.tags] : newItem.tags,
          userId
        });
      },
      { body: 'item' }
    )
    .get('/items', async ({ userId, set }) => {
      const items = await itemService.getAllForUser(userId);

      set.headers['Content-Type'] = 'text/html; charset=utf-8';

      return items
        .map((item) => (
          <div class="group">
            <div class="overflow-hidden rounded-md group-hover:opacity-75">
              <img src={item.image} alt={item.id} />
            </div>
            <div class="mt-4">
              <div>
                <h3 class="text-gray-700">{item.name}</h3>
                {item.location && (
                  <span class="mt-1 text-sm text-gray-500">
                    {item.location}
                  </span>
                )}
                <div class="mt-1">
                  {item.tags.map((t) => (
                    <span class="mr-1 rounded-md bg-orange-400 px-2 py-1 text-xs uppercase text-white last:mr-0">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
        .join('');
    });

export default itemRoutes;
