import { html } from '@elysiajs/html';
import { Elysia, t } from 'elysia';
import ItemCard from '../components/ItemCard';
import ItemInfo from '../components/ItemInfo';
import { authenticator } from '../plugins';
import itemService from '../services/item-service';

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

        return items
          .map(item => <ItemCard {...item} />)
          .join('');
      }
    )
    .group(
      '/item/:itemId',
      app =>
        app
          .get(
            '/',
            async ({ userId, params: { itemId } }) => {
              const item = await itemService.getOne(userId, itemId);

              return <ItemInfo {...item} />;
            }
          )
          .patch(
            '/name',
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
            '/location',
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
          .patch(
            '/tag',
            async ({ userId, params: { itemId }, body: { tagName } }) => {
              await itemService.addTag({ userId, itemId, tagName });

              return (
                <li class="rounded-lg bg-orange-200 px-2 py-1">
                  <div class='flex items-center text-xs uppercase'>
                    {tagName}
                    <img
                      src="/public/cross.svg"
                      class='h-6 pl-2 cursor-pointer'
                      hx-delete={`/api/item/${itemId}/tag`}
                      hx-vals={`{ "tagName": "${tagName}" }`}
                      hx-target='closest li'
                      hx-swap='delete' />
                  </div>
                </li>
              );
            },
            {
              body: t.Object({
                tagName: t.String()
              })
            }
          )
          .delete(
            '/tag',
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
            '/',
            async ({ userId, params: { itemId }, set }) => {
              await itemService.deleteOne({ userId, itemId });

              set.headers['HX-Redirect'] = '/';
              set.status = 204;
            }
          )
    )
    ;

export default itemRoutes;
