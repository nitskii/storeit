import { html } from '@elysiajs/html';
import { Elysia, t } from 'elysia';
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
        
        if (set.status == 400) {
          set.headers['HX-Reswap'] = 'afterend';

          switch (error.message) {
            case 'Локація має мати назву':
              set.headers['HX-Retarget'] = '#name-input';
              break;
            case 'Ідентифікатор локації має бути UUID':
              set.headers['HX-Retarget'] = '#location-id-input';
              break;
          }
        } else if (error instanceof HttpError) {
          set.headers['HX-Reswap'] = 'afterend';
          set.status = error.status;
          
          switch(error.code) {
            case 'LOCATION_NOT_FOUND':
            case 'LOCATION_SELF_REFERENCE':
              set.headers['HX-Retarget'] = '#location-id-input';
              break;
            case 'LOCATION_ALREADY_EXISTS':
              set.headers['HX-Retarget'] = '#name-input';
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
      .model({
        location: t.Object({
          name: t.String({
            error: 'Локація має мати назву',
            minLength: 1
          }),
          parentId: t.Optional(t.String({
            error: 'Ідентифікатор локації має бути UUID',
            format: 'uuid'
          }))
        })
      })
      .use(html())
      .post(
        '/location',
        async ({ body: newLocation, userId, set }) => {
          await locationService.create({ ...newLocation, userId });
        
          set.status = 204;
          set.headers['HX-Trigger'] = 'dataUpdate';
        },
        {
          body: 'location'
        }
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
