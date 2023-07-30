import { randomUUID } from "crypto";
import { Elysia, t } from "elysia";
import itemController from "../controllers/item.controller";

export default (app: Elysia) => app
    .model({
        item: t.Object({
            name: t.String(),
            location: t.Optional(t.String())
        })
    })
    .post(
        "/item",
        ({ body }) => itemController.create({ id: randomUUID(), ...body }),
        { body: "item" }
    )
    .get(
        "/item",
        () => itemController.getAll()
    );