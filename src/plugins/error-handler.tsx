import Elysia from 'elysia';

const errorHandler = new Elysia({ name: 'errorHandler' })
  .onError(({ error: { message }, set }) => {
    switch(message) {
      case 'Invalid nickname':
        set.headers['Content-Type'] = 'text/html;charset=utf-8';
        set.headers['X-Field'] = 'nickname';

        return (
          <div class="pl-2 pt-1 text-red-500">
            Нікнейм повинен мати від 3 до 30 символів
          </div>
        );
      case 'Invalid password':
        set.headers['Content-Type'] = 'text/html;charset=utf-8';
        set.headers['X-Field'] = 'password';

        return (
          <div class="pl-2 pt-1 text-red-500">
            Пароль повинен мати від 8 до 50 символів
          </div>
        );
      case 'Incorrect password':
        set.status = 401;
        set.headers['Content-Type'] = 'text/html;charset=utf-8';
        set.headers['X-Field'] = 'password';

        return (
          <div class="pl-2 pt-1 text-red-500">
            Невірний пароль
          </div>
        );
      case 'User not found':
        set.status = 404;
        set.headers['Content-Type'] = 'text/html;charset=utf-8';
        set.headers['X-Field'] = 'nickname';

        return (
          <div class="pl-2 pt-1 text-red-500">
            Нікнейм не знайдено
          </div>
        );
      case 'User exists':
        set.status = 409;
        set.headers['Content-Type'] = 'text/html;charset=utf-8';
        set.headers['X-Field'] = 'nickname';

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
      case 'Location exists':
      case 'Parent location already has such child':
      case 'Parent location can\'t be a child of itself':
        set.status = 409;
        return;
    }

    console.log(message);
  });

export default errorHandler;
