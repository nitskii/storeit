import { Elysia, t } from "elysia";
import itemController from "../controllers/item.controller";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const itemRoutes = (app: Elysia) => app
    .model({
        item: t.Object({
            name: t.String(),
            image: t.File({
                type: "image",
                maxSize: MAX_IMAGE_SIZE
            }),
            location: t.Optional(t.String()),
            tags: t.Optional(t.Array(t.String()))
        })
    })
    .post(
        "/item",
        async ({ body: item }) => {
            await itemController.create(item);
        },
        { body: "item" }
    )
    .get(
        "/item",
        async () => {
            return await itemController.getAll();
        }
    );

export default itemRoutes;