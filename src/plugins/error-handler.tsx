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
      return '';
    case 'User not found':
      set.status = 404;
      return '';
    case 'User exists':
      set.status = 409;
      return '';
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
      return '';
    }

    console.log(message);

    return (
      <div class='pl-2 pt-1 text-red-500'>
        Щось пішло не так
      </div>
    );
  });

export default errorHandler;
