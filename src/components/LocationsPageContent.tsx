import LocationSelectionModal from './LocationSelectionModal';

const LocationsPageContent = () => (
  <>
    <head>
      <title>Локації</title>
    </head>
    <header class="bg-orange-100">
      <nav class="flex justify-end space-x-2 p-2">
        <a
          href="/"
          hx-boost="true"
          class="rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus:outline focus:outline-2 focus:outline-orange-300">
          Головна
        </a>
        <button
          id="button-show-location-modal"
          class="rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
          onclick="showLocationModal()">
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
      class="flex h-full items-center justify-center"
      hx-get="/api/locations"
      hx-trigger="load"
    />
    <div
      id="location-modal"
      class="fixed left-0 top-0 hidden h-screen w-full items-center justify-center bg-black bg-opacity-50 px-4">
      <div class="flex w-full flex-col items-center justify-center space-y-4 rounded-lg bg-orange-100 p-4 shadow sm:max-w-md">
        <form class="flex w-full flex-col items-center space-y-4">
          <div id="location-name-input-block" class="w-full">
            <input
              id="location-name-input"
              type="text"
              name="name"
              class="w-full rounded-lg border-0 bg-orange-200 placeholder:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300"
              placeholder="Назва локації"
            />
          </div>
          <label class="flex w-full cursor-pointer items-center">
            <input
              type="checkbox"
              class="mx-2 h-5 w-5 appearance-none rounded-md border-0 bg-orange-200 checked:bg-orange-300 hover:bg-orange-300 hover:checked:bg-orange-300 focus:ring-1 focus:ring-orange-300 focus:ring-offset-0 focus:checked:bg-orange-300 focus:checked:ring-orange-200"
              onchange="toggleLocationSelectionBlock(event.target.checked)"
            />
            Належить до іншої локації
          </label>
          <div id="location-selection-block" class="w-full" hidden>
            <div
              id="selected-location-message"
              class="px-2 pb-1 text-sm text-gray-600"
              hidden
            />
            <input
              type="hidden"
              id="location-id-input"
              name="parentId"
              disabled
            />
            <button
              id="button-show-location-selection-modal"
              type="button"
              class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
              onclick="showLocationSelectionModal()">
              Оберіть локацію
            </button>
          </div>
          <button
            class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
            hx-post="/api/location"
            hx-on="htmx:beforeSwap: handlePostLocationResult(event.detail)">
            Додати
          </button>
        </form>
        <button
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
          onclick="hideLocationModal()">
          Закрити
        </button>
      </div>
    </div>
    <LocationSelectionModal />
    <div
      id="location-result-modal"
      class="fixed left-0 top-0 hidden h-screen w-full items-center justify-center bg-black bg-opacity-50 px-4">
      <div class="flex w-full flex-col items-center space-y-4 rounded-lg bg-orange-100 p-4 shadow sm:max-w-md">
        <div class="flex items-center gap-2">
          Додано
          <img src="/public/checkmark.svg" class="h-4 w-4" />
        </div>
        <button
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
          onclick="hideLocationResultModal();showLocationModal()">
          Додати ще
        </button>
        <button
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
          onclick="hideLocationResultModal()">
          Закрити
        </button>
      </div>
    </div>
  </>
);

export default LocationsPageContent;
