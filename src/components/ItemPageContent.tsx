const ItemPageContent = ({ itemId }: { itemId: string }) => (
  <>
    <head>
      <title>Предмет</title>
    </head>
    <header class="flex-none bg-orange-100">
      <nav class="flex justify-end p-2">
        <ul
          id="menu"
          class="fixed right-0 top-0 hidden space-y-2 bg-orange-100 px-10 py-16 md:relative md:flex md:space-x-2 md:space-y-0 md:bg-transparent md:p-0">
          <li class="fixed right-6 top-4 md:hidden">
            <button class="text-right text-4xl" onclick="toggleMenu()">
              &times;
            </button>
          </li>
          <li>
            <a
              href="/"
              hx-boost="true"
              class="block w-full rounded-lg bg-orange-200 p-2 text-center hover:bg-orange-300 focus:outline focus:outline-2 focus:outline-orange-300">
              Головна
            </a>
          </li>
          <li>
            <a
              href="/locations"
              hx-boost="true"
              class="block w-full rounded-lg bg-orange-200 p-2 text-center hover:bg-orange-300 focus:outline focus:outline-2 focus:outline-orange-300">
              Локації
            </a>
          </li>
          <li>
            <button
              class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
              hx-post="/api/logout">
              Вийти
            </button>
          </li>
        </ul>
        <button class="text-4xl md:hidden" onclick="toggleMenu()">
          &#9776;
        </button>
      </nav>
    </header>
    <main
      class="flex-grow p-4"
      hx-get={`/api/item/${itemId}`}
      hx-trigger="load"
      {...{
        'hx-on::before-swap': 'event.detail.shouldSwap = true'
      }}
    />
    <div
      id="tag-modal"
      class="fixed left-0 top-0 hidden h-screen w-full items-center justify-center bg-black bg-opacity-50 px-4">
      <div
        class="flex w-full flex-col items-center justify-center space-y-4 rounded-lg bg-orange-100 p-4 shadow sm:max-w-md">
        <form class="flex w-full flex-col items-center space-y-4">
          <input
            name="tagName"
            class="w-full rounded-lg border-0 bg-orange-200 placeholder:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300"
            placeholder="Назва тегу"
            list="tags-datalist" />
          <datalist
            id="tags-datalist"
            hx-get="/api/tags"
            hx-trigger="tagModalOpened"
          />
          <button
            class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
            hx-post={`/api/item/${itemId}/tag`}
            hx-target="#tags-list"
            hx-swap="beforeend"
            {...{ 'hx-on::after-request': 'this.form.reset();hideTagModal()' }}>
            Додати
          </button>
        </form>
        <button
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
          onclick="hideTagModal()">
          Закрити
        </button>
      </div>
    </div>
  </>
);

export default ItemPageContent;
