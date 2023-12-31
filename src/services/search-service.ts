import itemService from './item-service';

const find = async ({ userId, query }: { userId: string, query: string }) => {
  const userItems = await itemService.getAll(userId);
  const result = [];
  const lowerCaseQuery = query.toLowerCase();

  result.push(...userItems.filter(i => i.name.toLowerCase().includes(lowerCaseQuery)));
  result.push(...userItems.filter(i => i.tags.some(t => t.toLowerCase().includes(lowerCaseQuery))));
  result.push(...userItems.filter(i => i.location?.toLowerCase().includes(lowerCaseQuery)));

  return [ ...new Set(result) ];
};

export default {
  find
};
