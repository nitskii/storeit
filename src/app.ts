import { Elysia } from "elysia";
import itemRoutes from "./routes/item.routes";

new Elysia()
  .use(itemRoutes)
  .listen(
    process.env.PORT ?? 8080,
    ({ hostname, port }) => {
      console.log(`Server started at ${hostname}:${port}`);
    }
  );