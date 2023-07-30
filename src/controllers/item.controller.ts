import db from "../db/db";
import { Item } from "../types";

const create = (item: Item) => db.push(item);

const getAll = () => db;

export default {
    create,
    getAll
};