import { v2 as cloudinary } from "cloudinary";
import { Elysia } from "elysia";
import baseRoutes from "./routes/base.routes";
import itemRoutes from "./routes/item.routes";
import userRoutes from "./routes/user.routes";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

new Elysia()
    .use(baseRoutes)
    .use(userRoutes)
    .use(itemRoutes)
    .listen(
        process.env.PORT ?? 8080,
        ({ hostname, port }) => {
            console.log(`Server started at http://${hostname}:${port}`);
        }
    );