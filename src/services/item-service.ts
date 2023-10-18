import { v2 as cloudinary } from 'cloudinary';
import { and, eq, sql } from 'drizzle-orm';
import db from '../db';
import { items, tagsToItems } from '../db/schema';
import { DeleteItem, NewItem } from '../types';
import locationService from './location-service';
import tagService from './tag-service';

const create = async (newItem: NewItem) => {
  const { locationId, tags, image, userId } = newItem;

  if (locationId) {
    const locationExists = await locationService.existsById(locationId);

    if (!locationExists) {
      throw new Error('Location not found');
    }
  }

  const tagIds: { id: string }[] = [];

  if (tags) {
    tagIds.push(...(await tagService.createMany(tags, userId)));
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
      image: imageUrl
    })
    .returning({ newItemId: items.id });

  tagIds.length &&
    (await db
      .insert(tagsToItems)
      .values(tagIds.map((tag) => ({ tagId: tag.id, itemId: newItemId }))));
};

const itemsQuery = db.query.items
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
        with: {
          tag: {
            columns: { name: true }
          }
        }
      },
      location: {
        columns: { name: true }
      }
    }
  })
  .prepare();

const getAllForUser = async (userId: string) => {
  const rows = await itemsQuery.execute({ userId });

  return rows.map((row) => ({
    ...row,
    location: row.location && row.location.name,
    tags: row.tags.map((t) => t.tag.name)
  }));
};

const itemQuery = db.query.items
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
        with: {
          tag: {
            columns: { name: true }
          }
        }
      },
      location: {
        columns: { name: true }
      }
    }
  })
  .prepare();

const getOneForUser = async (userId: string, itemId: string) => {
  const item = await itemQuery.execute({ userId, itemId });

  if (!item) {
    throw new Error('Item not found');
  }

  return {
    ...item,
    location: item.location && item.location.name,
    tags: item.tags.map((t) => t.tag.name)
  };
};

const deleteOne = async ({ userId, itemId }: DeleteItem) => {
  try {
    await db.transaction(async (tx) => {
      const itemToDelete = await tx.query.items.findFirst({
        columns: { id: true, userId: true },
        where: and(eq(items.id, itemId), eq(items.userId, userId))
      });

      if (!itemToDelete) {
        tx.rollback();
        return;
      }

      await tx
        .delete(items)
        .where(
          and(
            eq(items.id, itemToDelete.id),
            eq(items.userId, itemToDelete.userId)
          )
        );
    });
  } catch (err) {
    throw new Error('Item not found');
  }
};

export default {
  create,
  getAllForUser,
  getOneForUser,
  deleteOne
};
