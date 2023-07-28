import { Elysia } from "elysia";
import { itemPlugin } from "./plugins/item.plugin";

new Elysia()
  .use(itemPlugin)
  .listen(
    process.env.PORT ?? 3000,
    ({ hostname, port }) => {
      console.log(`Server started at ${hostname}:${port}`);
    }
  );