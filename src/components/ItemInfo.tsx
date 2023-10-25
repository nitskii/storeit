import { Item } from '../types';
import TagListItem from './TagListItem';

const ItemInfo = (item: Item) => (
  <div class="flex h-full w-full">
    <div class="flex w-full flex-col space-y-2 rounded-lg bg-orange-100 p-2 shadow-lg md:flex-row md:space-x-2 md:space-y-0">
      <div class="h-fit overflow-hidden rounded-lg md:w-1/3">
        <img src={item.image} alt={item.id} />
      </div>
      <div class="flex w-full flex-grow flex-col justify-between space-y-2 p-2 md:w-2/3">
        <div class="space-y-2">
          <div class='flex space-x-2 items-center'>
            <h2 id='item-name' class="text-xl md:text-3xl font-bold">{item.name}</h2>
            <button class='p-2 cursor-pointer' onclick='showNameModal()'>
              <img src='/public/pencil.svg' class='h-4 sm:h-6' />
            </button>
          </div>
          <div class='flex space-x-2 items-center'>
            <h3 class="text-gray-600 md:text-lg">
              {item.location}
            </h3>
            <button class='p-2 cursor-pointer'>
              <img src='/public/pencil.svg' class='h-4' />
            </button>
          </div>
          <div class='flex'>
            <ul
              id='tags-list'
              class="flex flex-wrap items-center">
              {
                item.tags.map(
                  (tagName) => <TagListItem itemId={item.id} tagName={tagName} />
                )
              }
            </ul>
            <button
              class='bg-orange-200 rounded-lg p-1 cursor-pointer hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300'
              onclick="htmx.trigger('#tags-datalist', 'tagModalOpened');showTagModal()">
              <img src='/public/plus.svg' class='h-6' />
            </button>
          </div>
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
);

export default ItemInfo;
