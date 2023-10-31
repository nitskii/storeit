const LocationSelectionModal = () => (
  <>
    <head>
      <script
        defer
        src='/public/location-selection.js'
      />
    </head>
    <div
      id='location-selection-modal'
      class='hidden modal-background'>
      <div class='max-h-[50%] modal-content'>
        <div class='w-full'>
          <div
            id='current-location-chain-message'
            class='px-2 pb-1 text-sm text-gray-600'
            hidden
          />
          <ul
            id='locations-list'
            class='scroll h-full w-full overflow-auto rounded-lg bg-orange-200'
            hx-get='/api/root-locations'
            hx-trigger='loadData'>
            <div class='htmx-indicator flex justify-center'>
              <img src='/public/loading.svg' />
            </div>
          </ul>
        </div>
        <button
          id='button-select-location'
          class='w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300'
          onclick='handleSelectLocationButtonClick()'
          hidden
        />
        <button
          class='w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300'
          onclick='handleBackButtonClick()'>
          Назад
        </button>
      </div>
    </div>
  </>
);

export default LocationSelectionModal;
