import Elysia from 'elysia';

const errorHandler = new Elysia({ name: 'errorHandler' })
  .onError(({ error: { message }, set }) => {
    switch(message) {
      case 'Invalid nickname':
        set.headers['Content-Type'] = 'text/html;charset=utf-8';
        set.headers['HX-Retarget'] = '#nickname-input-block';
        set.headers['HX-Reswap'] = 'beforeend';

        return (
          <div class="pl-2 pt-1 text-red-500">
            Нікнейм повинен мати від 3 до 30 символів
          </div>
        );
      case 'Invalid password':
        set.headers['Content-Type'] = 'text/html;charset=utf-8';
        set.headers['HX-Retarget'] = '#password-input-block';
        set.headers['HX-Reswap'] = 'beforeend';

        return (
          <div class="pl-2 pt-1 text-red-500">
            Пароль повинен мати від 8 до 50 символів
          </div>
        );
      case 'JWT is invalid or expired':
        set.status = 400;
        return;
      case 'Invalid location name':
        set.headers['Content-Type'] = 'text/html;charset=utf-8';
        set.headers['HX-Retarget'] = '#location-name-input-block';
        set.headers['HX-Reswap'] = 'beforeend';

        return (
          <div class="pl-2 pt-1 text-red-500">
            Локація має мати назву
          </div> 
        );
      case 'Unauthorized':
        set.status = 401;
        return;
      case 'Incorrect password':
        set.status = 401;
        set.headers['Content-Type'] = 'text/html;charset=utf-8';
        set.headers['HX-Retarget'] = '#password-input-block';
        set.headers['HX-Reswap'] = 'beforeend';

        return (
          <div class="pl-2 pt-1 text-red-500">
            Невірний пароль
          </div>
        );
      case 'User not found':
        set.status = 404;
        set.headers['Content-Type'] = 'text/html;charset=utf-8';
        set.headers['HX-Retarget'] = '#nickname-input-block';
        set.headers['HX-Reswap'] = 'beforeend';

        return (
          <div class="pl-2 pt-1 text-red-500">
            Нікнейм не знайдено
          </div>
        );
      case 'User exists':
        set.status = 409;
        set.headers['Content-Type'] = 'text/html;charset=utf-8';
        set.headers['HX-Retarget'] = '#nickname-input-block';
        set.headers['HX-Reswap'] = 'beforeend';

        return (
          <div class="pl-2 pt-1 text-red-500">
            Нікнейм вже існує
          </div>
        );
      case 'Location exists':
      case 'Parent location already has such child':
      case 'Parent location can\'t be a child of itself':
        set.status = 409;
        set.headers['Content-Type'] = 'text/html;charset=utf-8';
        set.headers['HX-Retarget'] = '#location-name-input-block';
        set.headers['HX-Reswap'] = 'beforeend';

        return (
          <div class="pl-2 pt-1 text-red-500">
            Локація вже існує
          </div> 
        );
    }

  });

export default errorHandler;
