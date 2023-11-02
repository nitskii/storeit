import { html } from '@elysiajs/html';
import { Elysia, t } from 'elysia';
import validator from "validator";
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
        
        if (error instanceof HttpError) {
          set.headers['HX-Reswap'] = 'afterend';
          set.status = error.status;

          switch (error.code) {
            case 'INVALID_NAME':
              set.headers['HX-Retarget'] = '#name-input';
              break;
            case 'ITEM_NOT_FOUND':
              set.headers['HX-Reswap'] = 'innerHTML';

              return (
                <div class='text-6xl font-bold h-full flex items-center justify-center'>
                  {error.message}
                </div>
              );
            case 'LOCATION_NOT_FOUND':
            case 'INVALID_LOCATION':
              set.headers['HX-Retarget'] = '#location-id-input';
              break;
            case 'TAG_NOT_FOUND':
            case 'INVALID_TAG_NAME':
              set.headers['HX-Retarget'] = '#tag-input';
              break;
          }

          return (
            <div class='pl-2 pt-1 text-red-500'>
              {error.message}
            </div>
          );
        }

        set.headers['HX-Reswap'] = 'none';

        return error.message;
      }
    },
    app => app
      .use(authenticator)
      .use(html())
      // doesn't work when NODE_ENV is production
      // moved validation to handlers
      // .model({
      //   item: t.Object({
      //     name: t.String({
      //       error: 'Предмет має мати назву',
      //       minLength: 1
      //     }),
      //     image: t.File({
      //       // currently has a bug which doesn't allow to upload .webp and some other formats
      //       // type: 'image',
      //       maxSize: MAX_IMAGE_SIZE,
      //       error: 'Зображення має бути не більше 5 МБ'
      //     }),
      //     locationId: t.Optional(t.String()),
      //     tags: t.Optional(t.Union([ t.Array(t.String()), t.String() ]))
      //   })
      // })
      .model({
        item: t.Object({
          name: t.String(),
          image: t.File(),
          locationId: t.Optional(t.String()),
          tags: t.Optional(
            t.Union([
              t.Array(t.String()),
              t.String()
            ])
          )
        })
      })
      .post(
        '/item',
        async ({ body: newItem, userId, set }) => {
          let { name, image, locationId, tags } = newItem;

          if (!validator.isLength(name, { min: 1 })) {
            throw new HttpError(
              'Предмет має мати назву',
              'INVALID_NAME',
              400
            );
          }

          if (image.size > MAX_IMAGE_SIZE) {
            throw new HttpError(
              'Зображення має бути не більше 5 МБ',
              'INVALID_IMAGE_SIZE',
              400
            );
          }

          if (locationId && !validator.isUUID(locationId)) {
            throw new HttpError(
              'Ідентифікатор локації має бути UUID',
              'INVALID_LOCATION',
              400
            );
          }

          if (typeof tags == 'string') {
            tags = [ tags ];

            tags.forEach(tag => {
              if (!validator.isLength(tag, { min: 1 })) {
                throw new HttpError(
                  'Тег має мати назву',
                  'INVALID_TAG_NAME',
                  400
                );
              }
            });
          }
          
          await itemService.create({
            name,
            image,
            locationId,
            tags,
            userId
          });

          set.status = 204;
          set.headers['HX-Trigger'] = 'dataRefresh';
        },
        { body: 'item' }
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
            if (!validator.isLength(name, { min: 1 })) {
              throw new HttpError(
                'Предмет має мати назву',
                'INVALID_NAME',
                400
              );
            }

            await itemService.updateName({ userId, itemId, name });
            
            return name;
          },
          {
            body: t.Object({
              name: t.String()
            })
          }
        )
        .patch(
          '/location',
          async ({ userId, params: { itemId }, body: { locationId } }) => {
            if (!validator.isUUID(locationId)) {
              throw new HttpError(
                'Ідентифікатор локації має бути UUID',
                'INVALID_LOCATION',
                400
              );
            }

            const locationName = await itemService.updateLocation({ userId, itemId, locationId });
            
            return locationName;
          },
          {
            body: t.Object({
              locationId: t.String()
            })
          }
        )
        .patch(
          '/tag',
          async ({ userId, params: { itemId }, body: { tagName }, set }) => {
            if (!validator.isLength(tagName, { min: 1 })) {
              throw new HttpError(
                'Тег має мати назву',
                'INVALID_TAG_NAME',
                400
              );
            }

            await itemService.addTag({ userId, itemId, tagName });
            
            set.headers['HX-Reswap'] = 'beforeend';

            return <TagListItem itemId={itemId} tagName={tagName} />;
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
            if (!validator.isLength(tagName, { min: 1 })) {
              throw new HttpError(
                'Тег має мати назву',
                'INVALID_TAG_NAME',
                400
              );
            }

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
  );

export default itemRoutes;
