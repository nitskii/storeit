import {
  LocationSelectionModal,
  NavMenu
} from '.';

const HomePageContent = () => (
  <>
    <head>
      <title>Головна</title>
      <script
        defer
        src='/public/home.js'
      />
    </head>
    <header class='flex justify-between bg-orange-100 p-2 space-x-2 md:space-x-0'>
      <div class='w-full'>
        <input
          type='search'
          name='q'
          class='text-input'
          placeholder='Пошук предмету'
          hx-get='/api/search'
          hx-target='#items-container'
          hx-swap='outerHTML'
          hx-include="[name='q']"
          hx-trigger='keyup changed delay:200ms, search'
          hx-indicator='.htmx-indicator'
        />
      </div>
      <NavMenu>
        <li>
          <a
            class='link-button'
            href='/locations'
            hx-boost='true'>
            Локації
          </a>
        </li>
        <li>
          <button
            class='button'
            onclick="showItemModal()">
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
    <main>
      <div class='htmx-indicator flex h-full items-center justify-center'>
        <img src='/public/loading.svg' />
      </div>
      <section
        id='items-container'
        class='grid grid-cols-1 gap-y-4 p-4 sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-4'
        hx-get='/api/items'
        hx-trigger='load, dataRefresh from:body'
      />
    </main>
    <div
      id='item-modal'
      class='hidden modal-background'>
      <div class='modal-content'>
        <form class='flex w-full flex-col items-center space-y-4'>
          <div class='w-full'>
            <input
              id='name-input'
              name='name'
              class='text-input'
              placeholder='Назва предмету'
            />
          </div>
          <div class='w-full'>
            <input
              id='image-input'
              type='file'
              name='image'
              accept='image/*'
              class='file-input'
            />
          </div>
          <div
            id='location-selection-block'
            class='w-full'>
            <div
              id='selected-location-message'
              class='px-2 pb-1 text-sm text-gray-600'
              hidden
            />
            <button
              type='button'
              class='button'
              onclick='showLocationSelectionModal()'>
              Оберіть локацію
            </button>
            <input
              type='hidden'
              id='location-id-input'
              name='locationId'
              disabled
            />
          </div>
          <div
            id='tag-input-block'
            class='flex w-full flex-col justify-between'>
            <ul
              id='added-tags-list'
              class='mb-4 hidden flex-wrap gap-2'
            />
            <div class='flex w-full'>
              <input
                id='tag-input'
                list='tags-datalist'
                placeholder='Назва тегу'
                class='w-full rounded-l-lg border-0 bg-orange-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300'
              />
              <datalist
                id='tags-datalist'
                hx-get='/api/tags'
                hx-trigger='dataLoad from:body'
              />
              <button
                type='button'
                class='border-l-2 rounded-r-lg border-orange-100 bg-orange-200 px-4 py-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300'
                onclick='addTagToList()'>
                <img
                  src='/public/plus.svg'
                  class='h-6 w-6'
                />
              </button>
            </div>
          </div>
          <button
            class='button'
            hx-post='/api/item'
            hx-encoding='multipart/form-data'
            hx-swap='none'
            {...{ 'hx-on::before-swap': 'handlePostItemResult(event)' }}>
            Додати
          </button>
        </form>
        <button
          class='button'
          onclick='hideItemModal()'>
          Закрити
        </button>
      </div>
    </div>
    <LocationSelectionModal />
    <div
      id='item-result-modal'
      class='hidden modal-background'>
      <div class='modal-content'>
        <div class='flex items-center justify-center gap-2'>
          Додано
          <img
            src='/public/checkmark.svg'
            class='h-4 w-4'
          />
        </div>
        <button
          class='button'
          onclick='hideItemResultModal();showItemModal()'>
          Додати ще
        </button>
        <button
          class='button'
          onclick='hideItemResultModal()'>
          Закрити
        </button>
      </div>
    </div>
  </>
);

export default HomePageContent;
