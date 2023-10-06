import { randomUUID } from 'crypto';
import { relations } from 'drizzle-orm';
import { sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { items, locationsToLocations, users } from '.';

export const locations = sqliteTable('locations', {
  id: text('id').primaryKey().$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  userId: text('user_id').references(() => users.id).notNull()
}, (t) => ({
  uk: unique().on(t.name, t.userId)
}));

export const locationsRelations = relations(
  locations,
  ({ one, many }) => ({
    user: one(users, {
      fields: [locations.userId],
      references: [users.id]
    }),
    items: many(items),
    childLocations: many(locationsToLocations, {
      relationName: 'child'
    })
  })
);
