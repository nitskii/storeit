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
          <button
            class='button'
            hx-patch={`/api/item/${itemId}/name`}
            hx-target='#item-name'>
            Змінити
          </button>
        </form>
        <button
          class='button'
          onclick='hideNameUpdateModal()'>
          Закрити
        </button>
      </div>
    </div>
    <div
      id='location-update-modal'
      class='hidden modal-background'>
      <div class='modal-content'>
        <form class='flex w-full flex-col items-center space-y-4'>
          <div
            id='selected-location-message'
            class='px-2 pb-1 text-sm text-gray-600'
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
          <button
            class='button'
            hx-patch={`/api/item/${itemId}/location`}
            hx-target='#item-location'>
            Змінити
          </button>
        </form>
        <button
          class='button'
          onclick='hideLocationUpdateModal()'>
          Закрити
        </button>
      </div>
    </div>
    <LocationSelectionModal />
    <div
      id='tag-update-modal'
      class='hidden modal-background'>
      <div class='modal-content'>
        <form class='flex w-full flex-col items-center space-y-4'>
          <div class='w-full'>
            <input
              id='tag-input'
              name='tagName'
              list='tags-datalist'
              class='text-input'
              placeholder='Назва тегу'
            />
          </div>
          <datalist
            id='tags-datalist'
            hx-get='/api/tags'
            hx-trigger='dataLoad'
          />
          <button
            class='button'
            hx-patch={`/api/item/${itemId}/tag`}
            hx-target='#tags-list'
            {...{ 'hx-on::before-request': 'resetForm(event.target.form)' }}>
            Додати
          </button>
        </form>
        <button
          class='button'
          onclick='hideTagUpdateModal()'>
          Закрити
        </button>
      </div>
    </div>
  </>
);

export default ItemPageContent;
