import { v2 as cloudinary } from 'cloudinary';
import { eq } from 'drizzle-orm';
import db from '../db';
import { NewItem, ResponseItem, items, locations, tags, tagsToItems } from '../db/schema';
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
  
  const newTags: { id: string }[] = [];

  if (tags) {
    newTags.push(...await tagService.createMany(tags, userId));
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

  const [{ id: newItemId }] = await db
    .insert(items)
    .values({
      ...newItem,
      image: imageUrl
    })
    .returning({ id: items.id });

  newTags.length && await db
    .insert(tagsToItems)
    .values(
      newTags.map(tag => ({ tagId: tag.id, itemId: newItemId }))
    );
};

const getAllForUser = async (userId: string): Promise<ResponseItem[]> => {
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
    .leftJoin(tags, eq(tagsToItems.tagId, tags.id))
    .leftJoin(locations, eq(itemsSubquery.locationId, locations.id));
  
  return [
    ...rows
      .reduce(
        (result, row) => {
          result.has(row.id)
            ? result.get(row.id)!.tags.push(row.tag!)
            : result.set(row.id, {
              id: row.id,
              name: row.name,
              image: row.image,
              location: row.location,
              tags: row.tag ? [ row.tag ] : []
            });
      
          return result;
        },
        new Map<string, ResponseItem>())
      .values()
  ];
};

export default {
  create,
  getAllForUser
};
