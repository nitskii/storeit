const LocationsPageContent = () => (
  <>
    <head>
      <title>Локації</title>
    </head>
    <main hx-get="/api/root-locations" hx-trigger="load" />
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
          <img src="/public/checkmark.svg" class="h-4 w-4" />
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
  </>
);

export default LocationsPageContent;
