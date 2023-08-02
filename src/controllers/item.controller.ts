import { ItemData, default as itemModel } from "../models/item.model";

const create = async (item: ItemData) => {
    await itemModel.create(item);
};

const getAll = async () => {
    return await itemModel.getAll();
};

export default {
    create,
    getAll
};
