import { LocationSelectionModal, NavMenu } from '.';

type ItemPageProps = {
  itemId: string;
};

const ItemPageContent = ({ itemId }: ItemPageProps) => (
  <>
    <head>
      <title>Предмет</title>
      <script
        defer
        src='/public/item.js'
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
          <a
            href='/locations'
            hx-boost='true'
            class='link-button'>
            Локації
          </a>
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
      class='flex-grow p-4'
      hx-get={`/api/item/${itemId}`}
      hx-trigger='load'
      {...{ 'hx-on::before-swap': 'event.detail.shouldSwap = true' }}
    />
    <div
      id='name-update-modal'
      class='fixed left-0 top-0 hidden h-screen w-full items-center justify-center bg-black bg-opacity-50 px-4'>
      <div class='flex w-full flex-col items-center justify-center space-y-4 rounded-lg bg-orange-100 p-4 shadow sm:max-w-md'>
        <form class='flex w-full flex-col items-center space-y-4'>
          <input
            name='name'
            class='w-full rounded-lg border-0 bg-orange-200 placeholder:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300'
            placeholder='Назва предмету'
          />
          <button
            class='w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300'
            hx-patch={`/api/item/${itemId}/name`}
            hx-target='#item-name'
            hx-swap='innerHTML'
            {...{
              'hx-on::after-request': 'hideNameModal()'
            }}>
            Змінити
          </button>
        </form>
        <button
          class='w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300'
          onclick='hideNameModal()'>
          Закрити
        </button>
      </div>
    </div>
    <div
      id='location-update-modal'
      class='fixed left-0 top-0 hidden h-screen w-full items-center justify-center bg-black bg-opacity-50 px-4'>
      <div class='flex w-full flex-col items-center justify-center space-y-4 rounded-lg bg-orange-100 p-4 shadow sm:max-w-md'>
        <form class='flex w-full flex-col items-center space-y-4'>
          <div
            id='selected-location-message'
            class='px-2 pb-1 text-sm text-gray-600'
          />
          <input
            type='hidden'
            id='location-id-input'
            name='locationId'
            disabled
          />
          <button
            type='button'
            class='w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300'
            onclick='showLocationSelectionModal()'>
            Оберіть локацію
          </button>
          <button
            class='w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300'
            hx-patch={`/api/item/${itemId}/location`}
            hx-target='#item-location'
            hx-swap='innerHTML'
            {...{
              'hx-on::after-request':
                'hideLocationUpdateModal()'
            }}>
            Змінити
          </button>
        </form>
        <button
          class='w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300'
          onclick='hideLocationUpdateModal()'>
          Закрити
        </button>
      </div>
    </div>
    <LocationSelectionModal />
    <div
      id='tag-update-modal'
      class='fixed left-0 top-0 hidden h-screen w-full items-center justify-center bg-black bg-opacity-50 px-4'>
      <div class='flex w-full flex-col items-center justify-center space-y-4 rounded-lg bg-orange-100 p-4 shadow sm:max-w-md'>
        <form class='flex w-full flex-col items-center space-y-4'>
          <input
            name='tagName'
            class='w-full rounded-lg border-0 bg-orange-200 placeholder:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300'
            placeholder='Назва тегу'
            list='tags-datalist'
          />
          <datalist
            id='tags-datalist'
            hx-get='/api/tags'
            hx-trigger='tagModalOpened'
          />
          <button
            class='w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300'
            hx-patch={`/api/item/${itemId}/tag`}
            hx-target='#tags-list'
            hx-swap='beforeend'
            {...{
              'hx-on::after-request':
                'this.form.reset();hideTagModal()'
            }}>
            Додати
          </button>
        </form>
        <button
          class='w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300'
          onclick='hideTagModal()'>
          Закрити
        </button>
      </div>
    </div>
  </>
);

export default ItemPageContent;
