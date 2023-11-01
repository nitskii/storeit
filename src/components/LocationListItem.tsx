import { Location } from '../types';

const LocationListItem = ({ id, name, hasChildren }: Location) => {
  const requestPath = `/api/location/${id}/children`;

  if (hasChildren) {
    return (
      <li class='flex w-full cursor-pointer items-center justify-between border-b border-black last:border-none'>
        <div
          data-id={id}
          class='w-full py-2 pl-2 hover:bg-orange-300'
          onclick={`updateButtonSelectLocationState({ id: '${id}', name: '${name}' })`}>
          {name}
        </div>
        <button
          class='border-l border-black px-4 py-2 hover:bg-orange-300'
          hx-get={requestPath}
          hx-target='#locations-list'
          {...{ 'hx-on::before-request': `handleLoadButtonClick({ path: '${requestPath}', name: '${name}' })` }}>
          &gt;
        </button>
      </li>
    );
  }

  return (
    <li
      data-id={id}
      class='cursor-pointer border-b border-black p-2 last:border-none hover:bg-orange-300'
      onclick={`updateButtonSelectLocationState({ id: '${id}', name: '${name}' })`}>
      {name}
    </li>
  );
};

export default LocationListItem;