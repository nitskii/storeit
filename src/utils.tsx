import { Item } from './types';

export const mapItemsToHTML = (items: Item[]) => {
  return items
    .map((item) => (
      <a class="group h-fit" href={`/item/${item.id}`} hx-boost="true">
        <div class="overflow-hidden rounded-lg group-hover:opacity-75">
          <img src={item.image} alt={item.id} />
        </div>
        <div class="mt-1 flex flex-col items-center space-y-1">
          <span class="text-lg text-gray-700">{item.name}</span>
          {item.location && (
            <span class="block text-sm text-gray-500">{item.location}</span>
          )}
          <div class="space-x-1">
            {item.tags.map((tagName) => (
              <span class="rounded-lg bg-orange-200 px-2 py-1 text-xs uppercase">
                {tagName}
              </span>
            ))}
          </div>
        </div>
      </a>
    ))
    .join('');
};
