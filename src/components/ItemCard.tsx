import { Item } from '../types';

const ItemCard = (item: Item) => (
  <div class='bg-orange-100 text-center flex flex-col justify-between items-end space-y-2 rounded-lg p-4 hover:opacity-75'>
    <div class='space-y-2 w-full'>
      <img
        src={item.image}
        alt={item.id}
        class='rounded-lg'
      />
      <h2 class='text-xl font-bold'>{item.name}</h2>
      {item.location && (
        <h3 class='text-gray-600'>{item.location}</h3>
      )}
      {item.tags.length ? (
        <ul class='flex space-x-2 justify-center'>
          {item.tags.map((t) => (
            <li class='text-xs bg-orange-200 rounded-lg px-2 py-1 uppercase'>
              {t}
            </li>
          ))}
        </ul>
      ) : (
        <></>
      )}
    </div>
    <a
      href={`/item/${item.id}`}
      hx-boost='true'
      class='cursor-pointer underline underline-offset-[6px] hover:text-gray-600'>
      Переглянути
    </a>
  </div>
);

export default ItemCard;
