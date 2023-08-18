import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import db from '../db';
import { items, locations, tags, tagsToItems } from '../db/schema';
import { Item, NewItem } from '../types/item.types';
import locationService from './location.service';
import tagService from './tag.service';

const create = async (newItem: NewItem) => {
  const { location, tags, image } = newItem;

  const locationId = await locationService.getIdByName(location);

  if (!locationId) {
    throw new Error('Location not found');
  }

  if (tags) {
    await tagService.createMany(tags);
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

  await db
    .insert(items)
    .values({
      id: randomUUID(),
      ...newItem,
      image: imageUrl,
      locationId
    })
    .run();
};

const getAllForUser = async (userId: string): Promise<Item[]> => {
  const itemsSubquery = db
    .select({
      id: items.id,
      name: items.name,
      image: items.image,
      locationId: items.locationId
    })
    .from(items)
    .where(eq(items.userId, userId))
    .as('itemsSubquery');

  const rows = await db
    .select({
      id: itemsSubquery.id,
      name: itemsSubquery.name,
      image: itemsSubquery.image,
      location: locations.name,
      tag: tags.name
    })
    .from(tagsToItems)
    .rightJoin(itemsSubquery, eq(tagsToItems.itemId, itemsSubquery.id))
    .leftJoin(locations, eq(itemsSubquery.locationId, locations.id))
    .leftJoin(tags, eq(tagsToItems.tagId, tags.id))
    .all();

  const result = rows.reduce((acc, row) => {
    acc.has(row.id)
      ? acc.get(row.id)!.tags.push(row.tag!)
      : acc.set(row.id, {
        id: row.id,
        name: row.name,
        image: row.image,
        location: row.location,
        tags: row.tag ? [ row.tag ] : []
      });
    
    return acc;
  }, new Map<string, Item>());

  return [ ...result.values() ];
};

const getItemLocations = async (userId: string) => {
  const rows = await db
    .select({
      location: locations.name
    })
    .from(items)
    .where(eq(items.userId, userId))
    .leftJoin(locations, eq(items.locationId, locations.id))
    .all();

  return Array.from(
    rows.reduce(
      (acc, row) => acc.add(row.location),
      new Set<string>()
    )
  );
};

export default {
  create,
  getAllForUser,
  getItemLocations
};
