import html from "@elysiajs/html";
import { Elysia, t } from "elysia";
import itemService from "../services/item.service";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const itemRoutes = (app: Elysia) => app
    .use(html())
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
            await itemService.create(item);
        },
        { body: "item" }
    )
    .get(
        "/item",
        async ({ html }) => {
            const items = await itemService.getAll();

            return html(items.map(item => (`
              <div class="group relative">
                <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src="${item.image}"
                    alt="${item.id}"
                    class="h-full w-full object-cover object-center lg:h-full lg:w-full" />
                </div>
                <div class="mt-4 flex justify-between">
                  <div>
                    <h3 class="text-sm text-gray-700">
                      <a href="#">
                        <span aria-hidden="true" class="absolute inset-0"></span>
                        ${item.name}
                      </a>
                    </h3>
                    ${ item.location && `<p class="mt-1 text-sm text-gray-500">${item.location}</p>` }
                  </div>
                </div>
              </div>
            `)).join(""));
        }
    );

export default itemRoutes;