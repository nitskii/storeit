// import { eq } from 'drizzle-orm';
// import db from '../db';
// import { items, tags } from '../db/schema';

export type ItemData = {
  name: string;
  image: Blob;
  location: string;
  tags?: string[];
};

export type ItemResponse = {
  id: string;
  name: string;
  image: string;
  location: string;
  tags: string[];
};

// const create = async (item: ItemData) => {
//   const { image } = item;
//   const buffer = Buffer.from(await image.arrayBuffer());
//   cloudinary.uploader.upload(
//       `data:${image.type};base64,${buffer.toString("base64")}`,
//       {
//           unique_filename: true,
//           resource_type: "image"
//       },
//       (error, result) => {
//           console.log(error ?? result);
//       }
//   );
// };

// const getAllForUser = async (userId: string) => {
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
// };

export default {
  // getAllForUser
};
