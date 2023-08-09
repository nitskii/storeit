import cookie from "@elysiajs/cookie";
import { v2 as cloudinary } from "cloudinary";
import { Elysia } from "elysia";
import itemRoutes from "./routes/item.routes";
import userRoutes from "./routes/user.routes";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PATH_TO_VIEWS = "./src/views/";

new Elysia()
    .use(cookie())
    .get("/", ({ cookie, set }) => {
        if (cookie.auth) {
            set.status = 302;
            set.redirect = "/items";

            return;
        }

        return Bun.file(`${PATH_TO_VIEWS}index.html`);
    })
    .get("/items", ({ cookie, set }) => {
        if (!cookie.auth) {
            set.status = 302;
            set.redirect = "/";

            return;
        }

        return Bun.file(`${PATH_TO_VIEWS}items.html`);
    })
    .get("/public/:file", ({ params: { file } }) => Bun.file(`./public/${file}`))
    .get("/favicon.ico", () => Bun.file("./public/favicon.ico"))
    .group("/api", app => app
        .use(userRoutes)
        .use(itemRoutes)
    )
    .listen(process.env.PORT ?? 8080, ({ hostname, port }) => {
        console.log(`Server started at http://${hostname}:${port}`);
    });
