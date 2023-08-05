import { v2 as cloudinary } from "cloudinary";
import { Elysia } from "elysia";
import itemRoutes from "./routes/item.routes";
import userRoutes from "./routes/user.routes";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

new Elysia()
    .get("/", () => Bun.file("./src/views/index.html"))
    .get("/public/:file", ({ params: { file } }) => Bun.file(`./public/${file}`))
    .get("/favicon.ico", () => Bun.file("./public/favicon.ico"))
    .use(userRoutes)
    .use(itemRoutes)
    .listen(
        process.env.PORT ?? 8080,
        ({ hostname, port }) => {
            console.log(`Server started at ${hostname}:${port}`);
        }
    );