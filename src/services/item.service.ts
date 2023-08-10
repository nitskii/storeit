import { v2 as cloudinary } from "cloudinary";
import { eq } from "drizzle-orm";
import db from "../db";
import { Item, Tag, items, tags } from "../db/schema";

export type ItemData = {
    name: string,
    image: Blob,
    location?: string,
    tags?: string[]
}

type ItemResponse = {
    id: string,
    name: string,
    image: string,
    location?: string,
    tags: string[]
};

const create = async (item: ItemData) => {
    // const { image } = item;
    // const buffer = Buffer.from(await image.arrayBuffer());
    
    // cloudinary.uploader.upload(
    //     `data:${image.type};base64,${buffer.toString("base64")}`,
    //     {
    //         unique_filename: true,
    //         resource_type: "image"
    //     },
    //     (error, result) => {
    //         console.log(error ?? result);
    //     }
    // );
};

const getAll = async () => {
    const rows = await db
        .select()
        .from(items)
        .leftJoin(tags, eq(items.id, tags.itemId))
        .all();

    const result: ItemResponse[] = [];

    rows.forEach(row => {
        const foundIndex = result.findIndex(i => i.id === row.items.id);

        if (foundIndex > -1 && row.tags) {
            result[foundIndex].tags.push(row.tags.name);
        } else {
            const valueToAdd: ItemResponse = {
                id: row.items.id,
                name: row.items.name,
                image: row.items.image,
                tags: []
            }

            if (row.items.location) {
                valueToAdd.location = row.items.location;
            }

            if (row.tags) {
                valueToAdd.tags.push(row.tags.name);
            }

            result.push(valueToAdd);
        }
    });

    return result;
};

export default {
    create,
    getAll
}