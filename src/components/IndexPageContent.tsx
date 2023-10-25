import LocationSelectionModal from './LocationSelectionModal';

const IndexPageContent = () => (
  <>
    <head>
      <title>Головна</title>
    </head>
    <header class="flex-none bg-orange-100">
      <nav class="flex justify-between space-x-2 p-2 md:space-x-0">
        <div class="flex w-full overflow-hidden rounded-lg">
          <input
            type="search"
            name="q"
            placeholder="Пошук предмету"
            class="w-full border-0 bg-orange-200 placeholder:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300"
            hx-get="/api/search"
            hx-target="#items-container"
            hx-swap="outerHTML"
            hx-include="[name='q']"
            hx-trigger="keyup changed delay:200ms, search"
            hx-indicator=".htmx-indicator"
          />
        </div>
        <ul
          id="menu"
          class="fixed right-0 top-0 hidden space-y-2 bg-orange-100 px-10
                py-16 md:relative md:flex md:space-x-2 md:space-y-0 md:bg-transparent md:p-0">
          <li class="fixed right-6 top-4 md:hidden">
            <button class="text-right text-4xl" onclick="toggleMenu()">
              &times;
            </button>
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
              onclick="htmx.trigger('#tags-datalist', 'itemModalOpened');showItemModal()">
              Додати
            </button>
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
    <main class="flex-grow">
      <div class="htmx-indicator flex h-full items-center justify-center">
        <img src="/public/loading.svg" />
      </div>
      <section
        id="items-container"
        class="grid grid-cols-1 gap-y-4 p-4 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-4"
        hx-get="/api/items"
        hx-trigger="load, itemsUpdate from:body"
      />
    </main>
    <div
      id="item-modal"
      class="fixed left-0 top-0 hidden h-screen w-full items-center justify-center bg-black bg-opacity-50 px-4">
      <div class="flex w-full flex-col items-center justify-center space-y-4 rounded-lg bg-orange-100 p-4 shadow sm:max-w-md">
        <form class="flex w-full flex-col items-center space-y-4">
          <div class="w-full">
            <input
              type="text"
              name="name"
              class="w-full rounded-lg border-0 bg-orange-200 placeholder:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300"
              placeholder="Назва предмету"
            />
          </div>
          <div class="w-full">
            <input
              type="file"
              name="image"
              accept="image/*"
              class="w-full rounded-lg text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-200 file:px-4 file:py-2 hover:file:bg-orange-300 focus:outline-2 focus:outline-orange-300"
            />
          </div>
          <div id="location-selection-block" class="w-full">
            <div
              id="selected-location-message"
              class="px-2 pb-1 text-sm text-gray-600"
              hidden
            />
            <input
              type="hidden"
              id="location-id-input"
              name="locationId"
              disabled
            />
            <button
              type="button"
              class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
              onclick="showLocationSelectionModal()">
              Оберіть локацію
            </button>
          </div>
          <div
            id="tag-input-block"
            class="flex w-full flex-col justify-between">
            <ul id="added-tags-list" class="mb-4 hidden flex-wrap gap-2" />
            <div class="flex w-full overflow-hidden rounded-lg">
              <div class="w-full">
                <input
                  id="tag-input"
                  list="tags-datalist"
                  type="text"
                  class="block w-full border-0 bg-orange-200 placeholder:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300"
                  placeholder="Теги"
                />
              </div>
              <datalist
                id="tags-datalist"
                hx-get="/api/tags"
                hx-trigger="itemModalOpened"
              />
              <button
                type="button"
                class="border-l-2 border-orange-100 bg-orange-200 px-4 py-2"
                onclick="addTagToList()">
                <img src="/public/plus.svg" class="h-6 w-6" />
              </button>
            </div>
          </div>
          <button
            class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
            hx-post="/api/item"
            hx-encoding="multipart/form-data"
            hx-on="htmx:beforeSwap: handlePostItemResult(event.detail)">
            Додати
          </button>
        </form>
        <button
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
          onclick="hideItemModal()">
          Закрити
        </button>
      </div>
    </div>
    <LocationSelectionModal />
    <div
      id="item-result-modal"
      class="fixed left-0 top-0 hidden h-screen w-full items-center justify-center bg-black bg-opacity-50 px-4">
      <div class="flex w-full flex-col items-center space-y-4 rounded-lg bg-orange-100 p-4 shadow sm:max-w-md">
        <div class="flex items-center gap-2">
          Додано
          <img src="/public/checkmark.svg" class="h-4 w-4" />
        </div>
        <button
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
          onclick="hideItemResultModal();showItemModal()">
          Додати ще
        </button>
        <button
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
          onclick="hideItemResultModal()">
          Закрити
        </button>
      </div>
    </div>
  </>
);

export default IndexPageContent;
