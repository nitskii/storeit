import * as elements from "typed-html";

const Base = () => "<!DOCTYPE html>" + (
  <html lang="uk" class="h-full bg-white">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Шафа</title>
      <link href="/public/tailwind.css" rel="stylesheet" />
    </head>
    <body class="h-full">
      <main class="bg-gray-50">
        <div class="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          <div class="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0">
            <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
              <form class="space-y-4 md:space-y-6">
                <div>
                  <label
                    for="nickname"
                    class="mb-2 block text-sm font-medium text-gray-900">
                    Нікнейм
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    id="nickname"
                    class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-orange-300 focus:outline-none focus:ring-orange-300 sm:text-sm"
                    required=""
                  />
                </div>
                <div>
                  <label
                    for="password"
                    class="mb-2 block text-sm font-medium text-gray-900">
                    Пароль
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-orange-300 focus:outline-none focus:ring-orange-300 sm:text-sm"
                    required=""
                  />
                </div>
                <button
                  type="submit"
                  class="w-full rounded-lg bg-orange-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-300">
                  Увійти
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </body>
  </html>
);

export default Base;
