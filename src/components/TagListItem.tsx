import { TagBase } from '../types';

const TagListItem = ({ itemId, tagName }: TagBase) => (
  <li class="rounded-lg bg-orange-200 px-2 py-1 mr-2">
    <div class='flex items-center text-xs uppercase'>
      {tagName}
      <img
        src="/public/cross.svg"
        class='h-6 pl-2 cursor-pointer'
        hx-delete={`/api/item/${itemId}/tag`}
        hx-vals={`{ "tagName": "${tagName}" }`}
        hx-target='closest li'
        hx-swap='delete' />
    </div>
  </li>
);

export default TagListItem;
