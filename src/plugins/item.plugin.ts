import html from "@elysiajs/html";
import { randomUUID } from "crypto";
import { Elysia, t } from "elysia";
import db from "../db/db";

export const itemPlugin = (app: Elysia) => app
    .model({
        item: t.Object({
            name: t.String(),
            location: t.Optional(t.String())
        })
    })
    .use(html())
    .post(
        "/item",
        ({ body }) => {
            db.push({id: randomUUID(), ...body});
        },
        { body: "item" }
    )
    .get(
        "/item",
        () => db
    );