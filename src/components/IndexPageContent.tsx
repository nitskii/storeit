const IndexPageContent = () => (
  <>
    <head>
      <title>Головна</title>
    </head>
    <header class="bg-orange-100">
      <nav class="flex justify-end space-x-2 p-2">
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
      hx-trigger="load, itemsUpdate from:body"
    />
    <div class="fixed left-0 top-0 hidden h-screen w-full items-center justify-center bg-black bg-opacity-50 px-4">
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
          <button
            type="button"
            class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
            Оберіть локацію
          </button>
          <div class="flex w-full flex-col justify-between">
            <ul 
              id="selected-tags-list"
              class="mb-4 hidden flex-wrap gap-2"
            />
            <div class="flex w-full overflow-hidden rounded-lg">
              <input
                id="tag-input"
                list="tags-datalist"
                type="text"
                class="block w-full border-0 bg-orange-200 placeholder:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300"
                placeholder="Теги"
              />
              <datalist
                id="tags-datalist"
                hx-get="/api/tags"
                hx-trigger="load"
              />
              <button
                id="button-add-tag"
                type="button"
                class="border-l-2 border-orange-100 bg-orange-200 px-4 py-2">
                <img src="/public/plus.svg" class="h-6 w-6" />
              </button>
            </div>
            {/* <div id="tag-exists-message" class="pl-2 pt-1 text-red-500" hidden>
              Тег вже додано
            </div> */}
          </div>
          <button
            id="button-submit-new-item"
            type="submit"
            class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
            hx-post="/api/item"
            hx-encoding="multipart/form-data">
            Додати
          </button>
        </form>
        <button
          type="button"
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
          Назад
        </button>
        <button
          type="button"
          class="w-full rounded-lg bg-orange-200 p-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300">
          Закрити
        </button>
      </div>
    </div>
  </>
);

export default IndexPageContent;
