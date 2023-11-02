import { html } from '@elysiajs/html';
import { Elysia, t } from 'elysia';
import validator from 'validator';
import { LocationListItem } from '../components';
import { authenticator } from '../plugins';
import locationService from '../services/location-service';
import { Location, LocationWithChildren } from '../types';
import { HttpError } from '../utils';

const mapLocationsToListItems = (locations: Location[]) => {
  if (!locations.length) {
    return (
      <div class="py-1 text-center text-sm text-gray-600">
        Локації відсутні
      </div>
    );
  }

  return locations
    .map(location => <LocationListItem {...location} />)
    .join('');
};

const mapLocationsToListItemsRecursively = (
  locations: LocationWithChildren[]
) =>
  locations
    .map((l) => (
      <li>
        {l.name}
        {l.children.length ? (
          <ul class="pl-2">{mapLocationsToListItemsRecursively(l.children)}</ul>
        ) : (
          <></>
        )}
      </li>
    ))
    .join('');

const locationRoutes = new Elysia()
  .guard(
    {
      error: ({ error, set }) => {
        set.headers['Content-Type'] = 'text/html;charset=utf-8';
        
        if (error instanceof HttpError) {
          set.headers['HX-Reswap'] = 'afterend';
          set.status = error.status;
          
          switch(error.code) {
            case 'INVALID_LOCATION':
            case 'LOCATION_NOT_FOUND':
            case 'LOCATION_SELF_REFERENCE':
              set.headers['HX-Retarget'] = '#location-id-input';
              break;
            case 'INVALID_NAME':
            case 'LOCATION_ALREADY_EXISTS':
              set.headers['HX-Retarget'] = '#name-input';
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
      // doesn't work when NODE_ENV is production
      // moved validation to handlers
      // .model({
      //   location: t.Object({
      //     name: t.String({
      //       error: 'Локація має мати назву',
      //       minLength: 1
      //     }),
      //     parentId: t.Optional(t.String({
      //       error: 'Ідентифікатор локації має бути UUID',
      //       format: 'uuid'
      //     }))
      //   })
      // })
      .model({
        location: t.Object({
          name: t.String(),
          parentId: t.Optional(t.String())
        })
      })
      .use(html())
      .post(
        '/location',
        async ({ body: newLocation, userId, set }) => {
          const { name, parentId } = newLocation;

          if (!validator.isLength(name, { min: 1 })) {
            throw new HttpError(
              'Локація має мати назву',
              'INVALID_NAME',
              400
            );
          }

          if (parentId && !validator.isUUID(parentId)) {
            throw new HttpError(
              'Ідентифікатор локації має бути UUID',
              'INVALID_LOCATION',
              400
            );
          }

          await locationService.create({ ...newLocation, userId });
        
          set.status = 204;
          set.headers['HX-Trigger'] = 'dataUpdate';
        },
        { body: 'location' }
      )
      .get(
        '/root-locations',
        async ({ userId }) => {
          const locations = await locationService.getAllRootLocations(userId);
          
          return mapLocationsToListItems(locations);
        }
      )
      .get(
        '/location/:id/children',
        async ({ params: { id } }) => {
          const locations = await locationService.getChildrenById(id);
      
          return mapLocationsToListItems(locations);
        }
      )
      .get(
        '/locations',
        async ({ userId }) => {
          const locations = await locationService.getAllLocations(userId);
      
          return (
            <ul>
              {mapLocationsToListItemsRecursively(locations)}
            </ul>
          );
        }
      )
  );

export default locationRoutes;
