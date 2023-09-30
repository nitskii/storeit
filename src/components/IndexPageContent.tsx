const IndexPageContent = () => (
  <>
    <header class="bg-orange-100">
      <nav class="flex justify-end space-x-2 p-2">
        <button
          id="button-show-action-select-modal"
          class="rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
          Додати
        </button>
        <button
          class="rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
          hx-post="/api/logout">
          Вийти
        </button>
      </nav>
    </header>
    <main
      class="grid grid-cols-1 gap-y-4 p-4 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-4"
      hx-get="/api/items"
      hx-trigger="load, itemsUpdate from:body"></main>
    <div
      id="action-select-modal"
      class="fixed left-0 top-0 hidden h-screen w-full items-center justify-center bg-black bg-opacity-50 px-4">
      <div
        class="flex w-full flex-col items-center space-y-4 rounded-lg bg-orange-100 p-4 shadow sm:max-w-md">
        <button
          id="button-action-select-to-new-item"
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
          Додати предмет
        </button>
        <button
          id="button-action-select-to-new-location"
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
          Додати локацію
        </button>
        <button
          id="button-hide-action-select-modal"
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
          Закрити
        </button>
      </div>
    </div>
    <div
      id="new-item-modal"
      class="fixed left-0 top-0 hidden h-screen w-full items-center justify-center bg-black bg-opacity-50 px-4">
      <div
        class="flex w-full flex-col items-center justify-center space-y-4 rounded-lg bg-orange-100 p-4 shadow sm:max-w-md">
        <form
          id="item-form"
          class="flex w-full flex-col items-center space-y-4">
          <input
            type="text"
            name="name"
            class="w-full rounded-lg border-0 bg-orange-200 placeholder:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300"
            placeholder="Назва предмету"
            required="" />
          <input
            type="file"
            name="image"
            accept="image/*"
            class="w-full rounded-lg text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-200 file:px-4 file:py-2 hover:file:bg-orange-300 focus:outline-2 focus:outline-orange-300"
            required="" />
          <button
            type="button"
            class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
            Оберіть локацію
          </button>
          <div class="flex w-full flex-col justify-between">
            <ul
              id="selected-tags-list"
              class="mb-4 hidden flex-wrap gap-2"></ul>
            <div class="flex w-full overflow-hidden rounded-lg">
              <input
                id="tag-input"
                list="tags-datalist"
                type="text"
                class="block w-full border-0 bg-orange-200 placeholder:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300"
                placeholder="Теги" />
              <datalist
                id="tags-datalist"
                hx-get="/api/tags"
                hx-trigger="click from:button-action-select-to-new-item"></datalist>
              <button
                id="button-add-tag"
                type="button"
                class="border-l-2 border-orange-100 bg-orange-200 px-4 py-2">
                <img src="/public/plus.svg" class="h-6 w-6" />
              </button>
            </div>
            <div id="tag-exists-message" class="pl-2 pt-1 text-red-500" hidden>
              Тег вже додано
            </div>
          </div>
          <button
            id="button-submit-new-item"
            type="submit"
            class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
            hx-post="/api/item"
            hx-encoding="multipart/form-data"
            hx-trigger="submit from:#item-form">
            Додати
          </button>
        </form>
        <button
          id="button-new-item-to-action-select"
          type="button"
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
          Назад
        </button>
        <button
          id="button-hide-new-item-modal"
          type="button"
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
          Закрити
        </button>
      </div>
    </div>
    <div
      id="new-location-modal"
      class="fixed left-0 top-0 hidden h-screen w-full items-center justify-center bg-black bg-opacity-50 px-4">
      <div
        class="flex w-full flex-col items-center justify-center space-y-4 rounded-lg bg-orange-100 p-4 shadow sm:max-w-md">
        <form
          id="location-form"
          class="flex w-full flex-col items-center space-y-4">
          <div class="w-full">
            <input
              id="location-name-input"
              type="text"
              name="name"
              class="w-full rounded-lg border-0 bg-orange-200 placeholder:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300"
              placeholder="Назва локації"
              required="" />
            <div
              id="location-exists-message"
              class="pl-2 pt-1 text-red-500"
              hidden>
              Локація вже існує
            </div>
          </div>
          <label class="flex w-full cursor-pointer items-center">
            <input
              id="parent-selection-block-toggler"
              type="checkbox"
              class="mx-2 h-5 w-5 appearance-none rounded-md border-0 bg-orange-200 checked:bg-orange-300 hover:bg-orange-300 hover:checked:bg-orange-300 focus:ring-1 focus:ring-orange-300 focus:ring-offset-0 focus:checked:bg-orange-300 focus:checked:ring-orange-200" />
            Належить до іншої локації
          </label>
          <div id="parent-selection-block" class="w-full" hidden>
            <div
              id="selected-parent-message"
              class="px-2 pb-1 text-sm text-gray-600"
              hidden></div>
            <input
              type="hidden"
              id="parent-id-input"
              name="parentId"
              disabled />
            <button
              id="button-new-location-to-parent-select"
              type="button"
              class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
              Оберіть локацію
            </button>
          </div>
          <button
            type="submit"
            class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
            hx-post="/api/location"
            hx-trigger="submit from:#location-form"
            hx-on="htmx:afterRequest: handlePostLocationResult(event.detail)">
            Додати
          </button>
        </form>
        <button
          id="button-new-location-to-action-select"
          type="button"
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
          Назад
        </button>
        <button
          id="button-hide-new-location-modal"
          type="button"
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
          Закрити
        </button>
      </div>
    </div>
    <div
      id="parent-select-modal"
      class="fixed left-0 top-0 hidden h-screen w-full items-center justify-center bg-black bg-opacity-50 px-4">
      <div
        class="flex max-h-[50%] w-full flex-col items-center space-y-4 rounded-lg bg-orange-100 p-4 shadow sm:max-w-md">
        <div class="w-full">
          <div
            id="current-location-chain-message"
            class="px-2 pb-1 text-sm text-gray-600"
            hidden></div>
          <ul
            id="locations-list"
            class="scroll h-full w-full overflow-auto rounded-lg bg-orange-200"
            hx-get="/api/root-locations"
            hx-trigger="click from:#button-new-location-to-parent-select">
            <div class="htmx-indicator flex justify-center">
              <img src="/public/loading.svg" />
            </div>
          </ul>
        </div>
        <button
          id="button-select-parent"
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
          hidden></button>
        <button
          id="button-parent-select-back"
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
          Назад
        </button>
      </div>
    </div>
    <div
      id="location-result-modal"
      class="fixed left-0 top-0 hidden h-screen w-full items-center justify-center bg-black bg-opacity-50 px-4">
      <div
        class="flex w-full flex-col items-center space-y-4 rounded-lg bg-orange-100 p-4 shadow sm:max-w-md">
        <div class="flex items-center gap-2">
          Додано
          <img src="/public/checkmark.svg" width="16px" height="16px" />
        </div>
        <button
          id="button-location-result-to-new-location"
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
          Додати ще
        </button>
        <button
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
          Мої локації
        </button>
        <button
          id="button-hide-location-result-modal"
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
          Закрити
        </button>
      </div>
    </div>
    <script src="/public/htmx.min.js"></script>
    <script src="/public/index.base.js"></script>
    <script src="/public/index.items.js"></script>
    <script src="/public/index.locations.js"></script>
  </>
);

export default IndexPageContent;