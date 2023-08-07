import html from "@elysiajs/html";
import Elysia from "elysia";
import * as elements from "typed-html";
import Base from "../components/Base";

const baseRoutes = (app: Elysia) => app
    .use(html())
    .get("/", ({ html }) => html(<Base />))
    .get("/public/:file", ({ params: { file } }) => Bun.file(`./public/${file}`))
    .get("/favicon.ico", () => Bun.file("./public/favicon.ico"));

export default baseRoutes;