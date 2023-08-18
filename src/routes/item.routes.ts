import { Elysia, t } from 'elysia';
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
        tags: t.Optional(t.Union([
          t.Array(t.String()),
          t.String()
        ]))
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
          tags: typeof newItem.tags == 'string'
            ? [newItem.tags]
            : newItem.tags,
          userId
        });
      },
      { body: 'item' }
    )
    .get(
      '/items',
      async ({ userId, set }) => {
        const items = await itemService.getAllForUser(userId);

        set.headers['Content-Type'] = 'text/html; charset=utf8';

        return items.map((item) => `
          <div class="group relative">
            <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
              <img
                src="${item.image}"
                alt="${item.id}"
                class="h-full w-full object-cover object-center" />
            </div>
            <div class="mt-4 flex justify-between">
              <div>
                <h3 class="text-sm text-gray-700">
                  <a href="#">
                    <span aria-hidden="true" class="absolute inset-0"></span>
                    ${item.name}
                  </a>
                </h3>
                ${item.location && `<p class="mt-1 text-sm text-gray-500">${item.location}</p>`}
                <div class="mt-1">
                  ${item.tags.map((t) => `
                    <span class="text-xs inline-block py-1 px-2 uppercase rounded text-white bg-orange-400 last:mr-0 mr-1">
                    ${t}
                    </span>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `).join('');
      });

export default itemRoutes;
