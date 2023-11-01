import { LocationSelectionModal, NavMenu } from '.';

const LocationsPageContent = () => (
  <>
    <head>
      <title>Локації</title>
      <script
        defer
        src='/public/locations.js'
      />
    </head>
    <header class='bg-orange-100 flex justify-end p-2'>
      <NavMenu>
        <li>
          <a
            href='/'
            hx-boost='true'
            class='link-button'>
            Головна
          </a>
        </li>
        <li>
          <button
            class='button'
            onclick='showLocationModal()'>
            Додати
          </button>
        </li>
        <li>
          <button
            class='button'
            hx-post='/api/logout'>
            Вийти
          </button>
        </li>
      </NavMenu>
    </header>
    <main
      class='flex h-full items-center justify-center'
      hx-get='/api/locations'
      hx-trigger='load, dataUpdate from:body'
    />
    <div
      id='location-modal'
      class='hidden modal-background'>
      <div class='modal-content'>
        <form class='flex w-full flex-col items-center space-y-4'>
          <div class='w-full'>
            <input
              id='name-input'
              name='name'
              class='text-input'
              placeholder='Назва локації'
            />
          </div>
          <label class='flex w-full cursor-pointer items-center'>
            <input
              type='checkbox'
              class='mx-2 h-5 w-5 appearance-none rounded-md border-0 bg-orange-200 checked:bg-orange-300 hover:bg-orange-300 hover:checked:bg-orange-300 focus:ring-1 focus:ring-orange-300 focus:ring-offset-0 focus:checked:bg-orange-300 focus:checked:ring-orange-200'
              onchange='toggleLocationSelectionBlock(event.target)'
            />
            Належить до іншої локації
          </label>
          <div
            id='location-selection-block'
            class='w-full'
            hidden>
            <div
              id='selected-location-message'
              class='px-2 pb-1 text-sm text-gray-600'
              hidden
            />
            <input
              type='hidden'
              id='location-id-input'
              name='parentId'
              disabled
            />
            <button
              type='button'
              class='button'
              onclick='showLocationSelectionModal()'>
              Оберіть локацію
            </button>
          </div>
          <button
            class='button'
            hx-post='/api/location'
            {...{ 'hx-on::before-swap': 'handlePostLocationResult(event)' }}>
            Додати
          </button>
        </form>
        <button
          class='button'
          onclick='hideLocationModal()'>
          Закрити
        </button>
      </div>
    </div>
    <LocationSelectionModal />
    <div
      id='location-result-modal'
      class='hidden modal-background'>
      <div class='modal-content'>
        <div class='flex items-center gap-2'>
          Додано
          <img
            src='/public/checkmark.svg'
            class='h-4 w-4'
          />
        </div>
        <button
          class='button'
          onclick='hideLocationResultModal();showLocationModal()'>
          Додати ще
        </button>
        <button
          class='button'
          onclick='hideLocationResultModal()'>
          Закрити
        </button>
      </div>
    </div>
  </>
);

export default LocationsPageContent;
