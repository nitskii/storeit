import db from "./db";
import { Item, ItemPayload, items } from "./schema";

const create = async (item: ItemPayload) => {

};

const getAll = async () => {
    return await db.select().from(items).all();
};

export default {
    create,
    getAll
}
