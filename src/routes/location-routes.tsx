import { html } from '@elysiajs/html';
import { Elysia, t } from 'elysia';
import { authenticator } from '../plugins';
import locationService from '../services/location-service';

type Location = {
  id: string,
  name: string,
  hasChildren: boolean
}

const mapLocationsToListItems = (locations: Location[]) => {
  if (!locations.length) {
    return (
      <div class="py-1 text-center text-sm text-gray-600">
          Локації відсутні
      </div>
    );
  }

  return locations
    .map(({ id, name, hasChildren }) => {

      const requestPath = `/api/location/${id}/children`;

      if (hasChildren) {
        return (
          <li
            class="flex w-full cursor-pointer items-center justify-between border-b border-black last:border-none">
            <div
              data-id={id}
              class="w-full py-2 pl-2 hover:bg-orange-300"
              onclick="changeSelectedLocation(event.target)">
              {name}
            </div>
            <button 
              class="border-l border-black px-4 py-2 hover:bg-orange-300"
              hx-get={requestPath}
              hx-target='#locations-list'
              hx-on={`htmx:beforeRequest: handleLoadButtonClick('${requestPath}', '${name}');`}>
            &gt;
            </button>
          </li>
        );
      }

      return (
        <li
          data-id={id}
          class="cursor-pointer border-b border-black p-2 last:border-none hover:bg-orange-300"
          onclick="changeSelectedLocation(event.target)">
          {name}
        </li>
      );
    })
    .join('');
};

const locationRoutes = new Elysia()
  .use(authenticator)
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
      await locationService.create({
        ...newLocation,
        userId
      });

      set.status = 204;
    }, {
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
  );

export default locationRoutes;
