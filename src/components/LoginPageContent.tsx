const LoginPageContent = () => (
  <>
    <title>Вхід</title>
    <main class="h-full flex items-center px-4 sm:p-0 w-full sm:max-w-md sm:mx-auto">
      <div class="rounded-lg bg-orange-100 p-4 flex flex-col items-center w-full space-y-4">
        <form class="space-y-4 w-full">
          <div id="nickname-input-block">
            <input
              id="nickname-input"
              name="nickname"
              class="text-input"
              placeholder="Нікнейм"
            />
          </div>
          <div id="password-input-block">
            <input
              type="password"
              id="password-input"
              name="password"
              class="text-input"
              placeholder="Пароль"
            />
          </div>
          <button
            class="button"
            hx-post="/api/login"
            hx-swap="none"
            {...{ 'hx-on::before-swap': 'handleResponse(event)' }}>
            Увійти
          </button>
        </form>
        <a href="/signup" hx-boost="true" class="link">
          Я не маю акаунту
        </a>
      </div>
    </main>
  </>
);

export default LoginPageContent;
