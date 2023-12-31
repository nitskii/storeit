import { v2 as cloudinary } from 'cloudinary';
import { and, eq, sql } from 'drizzle-orm';
import db from '../db';
import {
  items, locations, tags, tagsToItems
} from '../db/schema';
import {
  Item,
  ItemBase,
  ItemLocationUpdate,
  ItemNameUpdate,
  ItemTagUpdate,
  NewItem
} from '../types';
import { HttpError } from '../utils';
import locationService from './location-service';
import tagService from './tag-service';

const create = async (newItem: NewItem) => {
  const {
    locationId,
    tags,
    image,
    userId
  } = newItem;

  if (locationId) {
    const locationExists =
      await locationService.existsById({ userId, locationId });

    if (!locationExists) {
      throw new HttpError('Локацію не знайдено', 'LOCATION_NOT_FOUND', 404);
    }
  }

  const tagIds: { id: string }[] = [];

  if (tags) {
    tagIds.push(...await tagService.createMany(tags, userId));
  }

  const buffer = Buffer.from(await image.arrayBuffer());
  const imageUrl: string = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      `data:${image.type};base64,${buffer.toString('base64')}`,
      {
        unique_filename: true,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result!.secure_url);
      }
    );
  });

  const [{ newItemId }] = await db
    .insert(items)
    .values({
      ...newItem,
      image: imageUrl,
      locationId: locationId || null
    })
    .returning({ newItemId: items.id });

  tagIds.length && await db
    .insert(tagsToItems)
    .values(
      tagIds.map((tag) => ({
        tagId: tag.id,
        itemId: newItemId
      }))
    );
};

const itemsQuery = db
  .query
  .items
  .findMany({
    columns: {
      id: true,
      name: true,
      image: true
    },
    where: eq(items.userId, sql.placeholder('userId')),
    with: {
      tags: {
        columns: {},
        with: { tag: { columns: { name: true } } }
      },
      location: { columns: { name: true } }
    }
  })
  .prepare();

const getAll = async (userId: string): Promise<Item[]> => {
  const rows = await itemsQuery.execute({ userId });

  return rows.map((row) => ({
    ...row,
    location: row.location && row.location.name,
    tags: row.tags.map((t) => t.tag.name)
  }));
};

const itemQuery = db
  .query
  .items
  .findFirst({
    columns: {
      id: true,
      name: true,
      image: true
    },
    where: and(
      eq(items.userId, sql.placeholder('userId')),
      eq(items.id, sql.placeholder('itemId'))
    ),
    with: {
      tags: {
        columns: {},
        with: { tag: { columns: { name: true } } }
      },
      location: { columns: { name: true } }
    }
  })
  .prepare();

const getOne = async (userId: string, itemId: string) => {
  const item = await itemQuery.execute({ userId, itemId });

  if (!item) {
    throw new HttpError('Предмет не знайдено', 'ITEM_NOT_FOUND', 404);
  }

  return {
    ...item,
    location: item.location && item.location.name,
    tags: item.tags.map((t) => t.tag.name)
  };
};

const updateName = async (updateData: ItemNameUpdate) => {
  const { userId, itemId, name } = updateData;

  const [ updatedItem ] = await db
    .update(items)
    .set({ name })
    .where(and(
      eq(items.id, itemId),
      eq(items.userId, userId)
    ))
    .returning({ id: items.id });

  if (!updatedItem) {
    throw new HttpError('Предмет не знайдено', 'ITEM_NOT_FOUND', 404);
  }
};

const updateLocation = async (updateData: ItemLocationUpdate) => {
  const { userId, itemId, locationId } = updateData;

  const existingLocation = await db
    .query
    .locations
    .findFirst({
      columns: { id: true, name: true },
      where: and(
        eq(locations.userId, userId),
        eq(locations.id, locationId)
      )
    });

  if (!existingLocation) {
    throw new HttpError('Локацію не знайдено', "LOCATION_NOT_FOUND", 404);
  }

  const [ updatedItem ] = await db
    .update(items)
    .set({ locationId })
    .where(and(
      eq(items.id, itemId),
      eq(items.userId, userId)
    ))
    .returning({ id: items.id });

  if (!updatedItem) {
    throw new HttpError('Предмет не знайдено', 'ITEM_NOT_FOUND', 404);
  }

  return existingLocation.name;
};

const addTag = async (updateData: ItemTagUpdate) => {
  const { userId, itemId, tagName } = updateData;

  const [ itemToUpdate, existingTag ] = await db.batch([
    db.query.items.findFirst({
      columns: { id: true },
      where: and(
        eq(items.userId, userId),
        eq(items.id, itemId)
      )
    }),
    db.query.tags.findFirst({
      columns: { id: true },
      where: and(
        eq(items.userId, userId),
        eq(tags.name, tagName)
      )
    })
  ]);

  if (!itemToUpdate) {
    throw new HttpError('Предмет не знайдено', 'ITEM_NOT_FOUND', 404);
  }

  if (existingTag) {
    await db
      .insert(tagsToItems)
      .values({
        itemId: itemToUpdate.id,
        tagId: existingTag.id
      });
  } else {
    const [{ newTagId }] = await db
      .insert(tags)
      .values({
        name: tagName,
        userId
      })
      .returning({ newTagId: tags.id });

    await db
      .insert(tagsToItems)
      .values({
        itemId: itemToUpdate.id,
        tagId: newTagId
      });
  }
};

const deleteTag = async (updateData: ItemTagUpdate) => {
  const { userId, itemId, tagName } = updateData;

  const [ itemToUpdate, existingTag ] = await db.batch([
    db.query.items.findFirst({
      columns: { id: true },
      where: and(
        eq(items.userId, userId),
        eq(items.id, itemId)
      )
    }),
    db.query.tags.findFirst({
      columns: { id: true },
      where: and(
        eq(items.userId, userId),
        eq(tags.name, tagName)
      )
    })
  ]);

  if (!itemToUpdate) {
    throw new HttpError('Предмет не знайдено', 'ITEM_NOT_FOUND', 404);
  }

  if (!existingTag) {
    throw new HttpError('Тег не знайдено', 'TAG_NOT_FOUND', 404);
  }

  const [ deletedRecord ] = await db
    .delete(tagsToItems)
    .where(
      and(
        eq(tagsToItems.itemId, itemToUpdate.id),
        eq(tagsToItems.tagId, existingTag.id)
      )
    )
    .returning();

  if (!deletedRecord) {
    throw new HttpError('Тег не знайдено', 'TAG_NOT_FOUND', 404);
  }
};

const deleteOne = async (deleteData: ItemBase) => {
  const { userId, itemId } = deleteData;

  await db
    .delete(tagsToItems)
    .where(eq(tagsToItems.itemId, itemId));

  const [ deletedItem ] = await db
    .delete(items)
    .where(
      and(
        eq(items.userId, userId),
        eq(items.id, itemId)
      )
    )
    .returning({ id: items.id });

  if (!deletedItem) {
    throw new HttpError('Предмет не знайдено', 'ITEM_NOT_FOUND', 404);
  }
};

export default {
  create,
  getAll,
  getOne,
  updateName,
  updateLocation,
  addTag,
  deleteTag,
  deleteOne
};
