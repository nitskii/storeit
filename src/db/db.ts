import { randomUUID } from "crypto";
import { Item } from "../types";

const db: Item[] = [
    { id: randomUUID(), name: "Кроссовки" },
    { id: randomUUID(), name: "Подушка", location: "Синий шкаф" },
    { id: randomUUID(), name: "Гирлянда" }
];

export default db;