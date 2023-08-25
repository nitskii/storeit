import Elysia from 'elysia';

const errorHandler = (app: Elysia) => app
  .onError(({ error, set }) => {
    switch (error.message) {
    case 'JWT is invalid or expired':
      set.status = 400;
      break;
    case 'Incorrect password':
    case 'Unauthorized':
      set.status = 401;
      break;
    case 'User not found':
      set.status = 404;
      break;
    case 'User exists':
    case 'Location exists':
      set.status = 409;
      break;
    }

    return {
      error: error.message
    };
  });

export default errorHandler;