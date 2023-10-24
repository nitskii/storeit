import { Item } from '../types';

const ItemCard = (item: Item) => (
  <div class='bg-orange-200 text-center rounded-lg p-4 space-y-2 hover:opacity-75'>
    <img src={item.image} alt={item.id} class='rounded-lg'/>
    <h2 class='text-xl font-bold'>{item.name}</h2>
    {
      item.location && (
        <h3 class='text-gray-600'>
          {item.location}
        </h3>
      )
    }
    {
      item.tags.length
        ? (
          <ul class='flex space-x-2 justify-center'>
            {item.tags.map(t => <li class='text-xs bg-orange-300 rounded-lg px-2 py-1 uppercase'>{t}</li>)}
          </ul>
        )
        : <></>
    }
  </div>
);

export default ItemCard;
