import { relations } from 'drizzle-orm';
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { locations } from '.';

export const locationsToLocations = sqliteTable('locationsToLocations', {
  parentId: text('parent_id').notNull().references(() => locations.id),
  childId: text('child_id').notNull().references(() => locations.id)
}, (t) => ({
  pk: primaryKey(t.parentId, t.childId)
}));

export const locationsToLocationsRelations = relations(
  locationsToLocations,
  ({ one }) => ({
    parent: one(locations, {
      fields: [locationsToLocations.parentId],
      references: [locations.id]
    }),
    child: one(locations, {
      fields: [locationsToLocations.childId],
      references: [locations.id],
      relationName: 'child'
    })
  })
);
