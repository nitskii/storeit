import { html } from '@elysiajs/html';
import { Elysia, t } from 'elysia';
import ItemCard from '../components/ItemCard';
import ItemInfo from '../components/ItemInfo';
import TagListItem from '../components/TagListItem';
import { authenticator } from '../plugins';
import itemService from '../services/item-service';
import { HttpError } from '../utils';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const itemRoutes = (app: Elysia) => app
  .guard(
    {
      error: ({ error, set }) => {
        set.headers['Content-Type'] = 'text/html;charset=utf-8';
        
        if (set.status == 400) {
          set.headers['HX-Reswap'] = 'afterend';
          
          switch (error.message) {
            case 'Тег має мати назву':
              set.headers['HX-Retarget'] = '#tag-input';
              break;
            case 'Предмет має мати назву':
              set.headers['HX-Retarget'] = '#name-input';
              break;
            case 'Зображення має бути не більше 5 МБ':
              set.headers['HX-Retarget'] = '#image-input';
              break;
          }
        } else if (error instanceof HttpError) {
          set.headers['HX-Reswap'] = 'afterend';
          set.status = error.status;

          switch (error.code) {
            case 'ITEM_NOT_FOUND':
              set.headers['HX-Reswap'] = 'innerHTML';

              return (
                <div class='text-6xl font-bold h-full flex items-center justify-center'>
                  {error.message}
                </div>
              );
            case 'LOCATION_NOT_FOUND':
              set.headers['HX-Retarget'] = '#location-id-input';
              break;
            case 'TAG_NOT_FOUND':
              set.headers['HX-Retarget'] = '#tag-input';
              break;
          }
        } else {
          set.headers['HX-Reswap'] = 'none';
        }

        return (
          <div class='pl-2 pt-1 text-red-500'>
            {error.message || 'Щось пішло не так'}
          </div>
        );
      }
    },
    app => app
      .use(authenticator)
      .use(html())
      .model({
        item: t.Object({
          name: t.String({
            error: 'Предмет має мати назву',
            minLength: 1
          }),
          image: t.File({
            // currently has a bug which doesn't allow to upload .webp and some other formats
            // type: 'image',
            maxSize: MAX_IMAGE_SIZE,
            error: 'Зображення має бути не більше 5 МБ'
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
          set.headers['HX-Trigger'] = 'dataRefresh';
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
        app => app
          .get(
            '/',
            async ({ userId, params: { itemId } }) => {
              const item = await itemService.getOne(userId, itemId);

              return <ItemInfo {...item} />;
            }
          )
        .patch(
          '/name',
          async ({ userId, params: { itemId }, body: { name } }) => {
            await itemService.updateName({ userId, itemId, name });
            
            return name;
          },
          {
            body: t.Object({
              name: t.String({
                error: 'Предмет має мати назву',
                minLength: 1
              })
            })
          }
        )
        .patch(
          '/location',
          async ({ userId, params: { itemId }, body: { locationId } }) => {
            const locationName = await itemService.updateLocation({ userId, itemId, locationId });
            
            return locationName;
          },
          {
            body: t.Object({
              locationId: t.String({
                error: 'Ідентифікатор локації має бути UUID',
                format: 'uuid'
              })
            })
          }
        )
        .patch(
          '/tag',
          async ({ userId, params: { itemId }, body: { tagName } }) => {
            await itemService.addTag({ userId, itemId, tagName });
            
            return <TagListItem itemId={itemId} tagName={tagName} />;
          },
          {
            body: t.Object({
              tagName: t.String({
                error: 'Тег має мати назву',
                minLength: 1
              })
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
              tagName: t.String({
                error: 'Тег має мати назву',
                minLength: 1
              })
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
  );

export default itemRoutes;
