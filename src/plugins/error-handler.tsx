import Elysia from 'elysia';

const errorHandler = new Elysia({ name: 'errorHandler' })
  .onError(({ code, error: { message }, set }) => {
    if (code === 'NOT_FOUND') {
      return Bun.file(`${process.env.VIEWS_DIR}404.html`);
    }

    set.headers['Content-Type']='text/html; charset=utf-8';
    
    switch(message) {
    case 'Incorrect password':
      set.status = 401;
      return (
        <div class="pl-2 pt-1 text-red-500">
            Невірний пароль
        </div>
      );
    case 'User not found':
      set.status = 404;
      return (
        <div class="pl-2 pt-1 text-red-500">
            Нікнейм не знайдено
        </div>
      );
    case 'User exists':
      set.status = 409;
      return (
        <div class="pl-2 pt-1 text-red-500">
            Нікнейм вже існує
        </div>
      );
    case 'JWT is invalid or expired':
      set.status = 400;
      return;
    case 'Unauthorized':
      set.status = 401;
      return;
    case 'Location not found':
    case 'Parent location not found':
      set.status = 404;
      return (
        <div class="pl-2 pt-1 text-red-500">
            Локацію не знайдено
        </div>
      );
    case 'Location exists':
      set.status = 409;
      return (
        <div class='pl-2 pt-1 text-red-500'>
            Локація вже існує
        </div>
      );
    }

    console.log(message);

    return (
      <div class='pl-2 pt-1 text-red-500'>
        Щось пішло не так
      </div>
    );
  });

export default errorHandler;
