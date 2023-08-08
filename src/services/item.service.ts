import { v2 as cloudinary } from "cloudinary";
import db from "../db";
import { items } from "../db/schema";

export type ItemData = {
    name: string,
    image: Blob,
    location?: string,
    tags?: string[]
}

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
    return await db.select().from(items).all();
};

export default {
    create,
    getAll
}