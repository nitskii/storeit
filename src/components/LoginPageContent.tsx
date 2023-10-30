const LoginPageContent = () => (
  <>
    <title>Вхід</title>
    {/* <main class="h-full">
      <section
        class="flex h-full flex-col justify-center px-4 sm:mx-auto sm:max-w-md">
        <div
          class="flex flex-col items-center space-y-4 rounded-lg bg-orange-100 p-4 shadow-md">
          <form
            class="flex w-full flex-col items-center space-y-4">
            <div
              id="nickname-input-block"
              class="w-full">
              <input
                id="nickname-input"
                type="text"
                name="nickname"
                class="w-full rounded-lg border-0 bg-orange-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300"
                placeholder="Нікнейм"/>
            </div>
            <div
              id="password-input-block"
              class="w-full">
              <input
                id="password-input"
                type="password"
                name="password"
                class="w-full rounded-lg border-0 bg-orange-200 focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300"
                placeholder="Пароль"/>
            </div>
            <button
              type="submit"
              class="w-full rounded-lg bg-orange-200 px-2 py-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
              hx-post="/api/login"
              hx-on="htmx:beforeSwap: handleRequestResult(event.detail)">
              Увійти
            </button>
          </form>
          <a
            href="/signup"
            hx-boost="true"
            class="cursor-pointer underline underline-offset-[6px] hover:text-gray-600">
            Я не маю акаунту
          </a>
        </div>
      </section>
    </main> */}
    <main class="h-full flex items-center px-4 sm:p-0 w-full sm:max-w-md sm:mx-auto">
      <div class="rounded-lg bg-orange-100 p-4 space-y-4 w-full">
        <form class="space-y-4">
          <div id="nickname-input-block">
            <input
              id="nickname-input"
              name="nickname"
              class="text-input"
              placeholder="Нікнейм" />
          </div>
          <div id="password-input-block">
            <input
              type="password"
              id="password-input"
              name="password"
              class="text-input"
              placeholder="Пароль" />
          </div>
          <button
            class="button"
            hx-post="/api/login"
            {...{'hx-on::before-swap': 'handleLogin(event)'}}
            hx-swap="none">
            Увійти
          </button>
        </form>
        <a
          href="/signup"
          hx-boost="true"
          class="link text-center">
          Я не маю акаунту
        </a>
      </div>
    </main>
  </>
);

export default LoginPageContent;
