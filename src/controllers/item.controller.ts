import itemModel from "../models/item.model";

const create = async () => {};

const getAll = async () => {
    return await itemModel.getAll();
};

export default {
    create,
    getAll
};