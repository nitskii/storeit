import LocationSelectionModal from './LocationSelectionModal';

const IndexPageContent = () => (
  <>
    <head>
      <title>Головна</title>
      
    </head>
    <header class='flex justify-between bg-orange-100 p-2 space-x-2 md:space-x-0'>
      <div class='w-full'>
        <input
          type='search'
          name='q'
          class='text-input'
          placeholder='Пошук предмету'
          hx-get="/api/search"
          hx-target="#items-container"
          hx-swap="outerHTML"
          hx-include="[name='q']"
          hx-trigger="keyup changed delay:200ms, search"
          hx-indicator=".htmx-indicator" />
      </div>
      <nav>
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
              class='link-button'
              href="/locations"
              hx-boost="true">
              Локації
            </a>
          </li>
          <li>
            <button
              class="button"
              onclick="htmx.trigger('#tags-datalist', 'itemModalOpened');showItemModal()">
              Додати
            </button>
          </li>
          <li>
            <button
              class="button"
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
    <main>
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
      class="hidden modal-background">
      <div class="modal-content">
        <form class="flex w-full flex-col items-center space-y-4">
          <div class="w-full">
            <input
              name="name"
              class="text-input"
              placeholder="Назва предмету"
            />
          </div>
          <div class="w-full">
            <input
              type="file"
              name="image"
              accept="image/*"
              class="file-input"
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
              class="button"
              onclick="showLocationSelectionModal()">
              Оберіть локацію
            </button>
          </div>
          <div
            id="tag-input-block"
            class="flex w-full flex-col justify-between">
            <ul
              id="added-tags-list"
              class="mb-4 hidden flex-wrap gap-2"
            />
            <div class="flex w-full">
              <input
                id="tag-input"
                list="tags-datalist"
                placeholder="Назва тегу"
                class="w-full rounded-l-lg border-0 bg-orange-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300"
              />
              <datalist
                id="tags-datalist"
                hx-get="/api/tags"
                hx-trigger="itemModalOpened"
              />
              <button
                type="button"
                class="border-l-2 rounded-r-lg border-orange-100 bg-orange-200 px-4 py-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
                onclick="addTagToList()">
                <img src="/public/plus.svg" class="h-6 w-6" />
              </button>
            </div>
          </div>
          <button
            class="button"
            hx-post="/api/item"
            hx-encoding="multipart/form-data"
            {...{ 'hx-on::before-swap': 'handlePostItemResult(event.detail)' }}>
            Додати
          </button>
        </form>
        <button
          class="button"
          onclick="hideItemModal()">
          Закрити
        </button>
      </div>
    </div>
    <LocationSelectionModal />
    <div
      id="item-result-modal"
      class="hidden modal-background">
      <div class="modal-content">
        <div class="flex items-center justify-center gap-2">
          Додано
          <img src="/public/checkmark.svg" class="h-4 w-4" />
        </div>
        <button
          class="button"
          onclick="hideItemResultModal();showItemModal()">
          Додати ще
        </button>
        <button
          class="button"
          onclick="hideItemResultModal()">
          Закрити
        </button>
      </div>
    </div>
  </>
);

export default IndexPageContent;
