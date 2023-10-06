import { relations } from 'drizzle-orm';
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { items, tags } from '.';

export const tagsToItems = sqliteTable('tagsToItems', {
  tagId: text('tag_id').notNull().references(() => tags.id),
  itemId: text('item_id').notNull().references(() => items.id)
}, (t) => ({
  pk: primaryKey(t.tagId, t.itemId)
}));

export const tagsToItemsRelations = relations(
  tagsToItems,
  ({ one }) => ({
    tag: one(tags, {
      fields: [tagsToItems.tagId],
      references: [tags.id]
    }),
    item: one(items, {
      fields: [tagsToItems.itemId],
      references: [items.id]
    })
  })
);
