import { Elysia, t } from "elysia";
import itemController from "../controllers/item.controller";

export default (app: Elysia) => app
    .model({
        item: t.Object({
            name: t.String(),
            location: t.Optional(t.String()),
            tags: t.Optional(t.Array(t.String()))
        })
    })
    .post(
        "/item",
        async ({ body }) => {
            console.log(body);
        },
        { body: "item" }
    )
    .get(
        "/item",
        async () => {
            return await itemController.getAll();
        }
    );