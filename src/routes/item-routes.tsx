import { html } from '@elysiajs/html';
import { Elysia, t } from 'elysia';
import ItemCard from '../components/ItemCard';
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
        tags: t.Optional(t.Union([ t.Array(t.String()), t.String() ]))
      })
    })
    .get(
      '/',
      async ({ userId }) => (
        <>
          {'<!DOCTYPE html>'}
          <html class='bg-slate-800 h-full'>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link href="/public/favicon.ico" rel="icon" />
              <link href="/public/tailwind.css" rel="stylesheet" />
            </head>
            <body class='h-full'>
              <div class='w-1/3 mx-auto flex items-center h-full'>
                <ItemCard {...(await itemService.getAll(userId))[3]} />
              </div>
            </body>
          </html>
        </>
      )
    )
    .post(
      '/item',
      async ({ body: newItem, userId, set }) => {
        await itemService.create({
          ...newItem,
          tags: typeof newItem.tags == 'string'
            ? [ newItem.tags ]
            : newItem.tags,
          userId
        });

        set.status = 204;
        set.headers['HX-Trigger'] = 'itemsUpdate';
      },
      {
        body: 'item'
      }
    )
    .get(
      '/items',
      async ({ userId }) => {
        const items = await itemService.getAll(userId);

        return mapItemsToHTML(items);
      }
    )
    .get(
      '/item/:itemId',
      async ({ userId, params: { itemId } }) => {
        const item = await itemService.getOne(userId, itemId);

        return (
          <>
            <div class="flex h-full w-full">
              <div class="flex w-full flex-col space-y-2 rounded-lg bg-orange-100 p-2 shadow-lg md:flex-row md:space-x-2 md:space-y-0">
                <div class="h-fit overflow-hidden rounded-lg md:w-1/3">
                  <img src={item.image} alt={item.id} />
                </div>
                <div class="flex w-full flex-grow flex-col justify-between space-y-2 p-2 md:w-2/3">
                  <div class="space-y-2">
                    <h3 class="text-xl md:text-3xl">{item.name}</h3>
                    <p class="text-base text-gray-600 md:text-lg">
                      {item.location}
                    </p>
                    <ul class="flex flex-wrap space-x-2">
                      {item.tags.map((tagName) => (
                        <li class="rounded-lg bg-orange-200 px-2 py-1 text-xs uppercase">
                          {tagName}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div class="flex justify-end space-x-2">
                    <button
                      hx-delete={`/api/item/${item.id}`}
                      hx-confirm="Видалити предмет?"
                      class="rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
                    Видалити
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      }
    )
    .patch(
      '/item/:itemId/name',
      async ({ userId, params: { itemId }, body: { name }, set }) => {
        await itemService.updateName({ userId, itemId, name });

        set.status = 204;
      },
      {
        body: t.Object({
          name: t.String()
        })
      }
    )
    .patch(
      '/item/:itemId/location',
      async ({ userId, params: { itemId }, body: { locationId }, set }) => {
        await itemService.updateLocation({ userId, itemId, locationId });

        set.status = 204;
      },
      {
        body: t.Object({
          locationId: t.String()
        })
      }
    )
    .post(
      '/item/:itemId/tag',
      async ({ userId, params: { itemId }, body: { tagName }, set }) => {
        await itemService.addTag({ userId, itemId, tagName });

        set.status = 204;
      },
      {
        body: t.Object({
          tagName: t.String()
        })
      }
    )
    .delete(
      '/item/:itemId/tag',
      async ({ userId, params: { itemId }, body: { tagName }, set }) => {
        await itemService.deleteTag({ userId, itemId, tagName });

        set.status = 204;
      },
      {
        body: t.Object({
          tagName: t.String()
        })
      }
    )
    .delete(
      '/item/:itemId',
      async ({ userId, params: { itemId }, set }) => {
        await itemService.deleteOne({ userId, itemId });

        set.headers['HX-Redirect'] = '/';
        set.status = 204;
      }
    );

export default itemRoutes;
