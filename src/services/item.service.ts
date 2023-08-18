import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import db from '../db';
import { items, locations, tags } from '../db/schema';
import { Item, NewItem } from '../types/item.types';

const create = async (newItem: NewItem) => {
  const [ existingLocation ] = await db
    .select({
      id: locations.id
    })
    .from(locations)
    .where(eq(locations.name, newItem.location))
    .limit(1)
    .all();

  if (!existingLocation) {
    throw new Error('Location not found');
  }

  if (newItem.tags) {
    await db
      .insert(tags)
      .values(newItem.tags.map(tag => ({
        id: randomUUID(),
        name: tag
      })))
      .onConflictDoNothing({
        target: tags.name
      })
      .run();
  }

  const { image } = newItem;
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
      locationId: existingLocation.id
    })
    .run();
};

const getAllForUser = async (userId: string): Promise<Item[]> => {
//   const rows = await db
//     .select({
//       id: items.id,
//       name: items.name,
//       image: items.image,
//       location: items.location,
//       tag: tags.name
//     })
//     .from(items)
//     .where(eq(items.userId, userId))
//     .leftJoin(tags, eq(items.id, tags.itemId))
//     .all();

  //   const result = rows.reduce((acc, row) => {
  //     acc.has(row.id)
  //       ? acc.get(row.id)!.tags.push(row.tag!)
  //       : acc.set(row.id, {
  //         id: row.id,
  //         name: row.name,
  //         image: row.image,
  //         location: row.location!,
  //         tags: row.tag ? [row.tag] : []
  //       });
    
  //     return acc;
  //   }, new Map<string, ItemResponse>());

  //   return [ ...result.values() ];
  return [];
};

const getItemLocations = async (userId: string) => {
  const rows = await db
    .select({
      location: locations.name
    })
    .from(items)
    .where(eq(items.userId, userId))
    .leftJoin(locations, eq(locations.itemId, items.id))
    .all();

  console.log(rows);
};

export default {
  create,
  getAllForUser,
  getItemLocations
};
