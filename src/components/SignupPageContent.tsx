const SignupPageContent = () => (
  <>
    <main class="h-full">
      <section
        class="flex h-full flex-col justify-center px-4 sm:mx-auto sm:max-w-md">
        <div
          class="flex flex-col items-center space-y-4 rounded-lg bg-orange-100 p-4 shadow-md">
          <form
            class="flex w-full flex-col items-center space-y-4"
            onsubmit="event.preventDefault()">
            <div class="w-full">
              <input
                id="signup-nickname-input"
                type="text"
                name="nickname"
                class="w-full rounded-lg border-0 bg-orange-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300"
                placeholder="Нікнейм"
                required="" />
              <div
                id="nickname-exists-message"
                class="pl-2 pt-1 text-red-500"
                hidden>
                Нікнейм вже існує
              </div>
            </div>
            <input
              type="password"
              name="password"
              class="w-full rounded-lg border-0 bg-orange-200 focus:ring-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-300"
              placeholder="Пароль"
              required="" />
            <button
              type="submit"
              class="w-full rounded-lg bg-orange-200 px-2 py-2 hover:bg-orange-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-300"
              hx-post="/api/signup"
              hx-trigger="submit from:form"
              hx-on="htmx:afterRequest: handleSignupResult(event.detail.xhr.status)">
              Зареєструватись
            </button>
          </form>
          <a
            href="/login"
            hx-boost="true"
            class="cursor-pointer underline underline-offset-[6px] hover:text-gray-600">
            Я вже маю акаунт
          </a>
        </div>
      </section>
    </main>
    <script src="/public/htmx.min.js"></script>
    <script src="/public/signup.js"></script>
  </>
);

export default SignupPageContent;
