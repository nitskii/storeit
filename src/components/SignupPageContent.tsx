const SignupPageContent = () => (
  <>
    <head>
      <title>Вхід</title>
    </head>
    <main class='h-full flex items-center px-4 sm:p-0 w-full sm:max-w-md sm:mx-auto'>
      <div class='rounded-lg bg-orange-100 p-4 flex flex-col items-center w-full space-y-4'>
        <form class='space-y-4 w-full'>
          <div>
            <input
              id='nickname-input'
              name='nickname'
              class='text-input'
              placeholder='Нікнейм'
            />
          </div>
          <div>
            <input
              type='password'
              id='password-input'
              name='password'
              class='text-input'
              placeholder='Пароль'
            />
          </div>
          <button
            class='button'
            hx-post='/api/signup'
            hx-swap='none'
            {...{ 'hx-on::before-swap': 'handleResponse(event)' }}>
            Зареєструватись
          </button>
        </form>
        <a
          href='/login'
          hx-boost='true'
          class='link'>
          Я вже маю акаунт
        </a>
      </div>
    </main>
  </>
);

export default SignupPageContent;
