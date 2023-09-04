import Elysia from 'elysia';

const NO_FORMAT = '\x1B[0m';
const F_BOLD = '\x1B[1m';
const COLOR_GREEN = '\x1B[38;5;46m';
const COLOR_BLUE = '\x1B[38;5;33m';
const COLOR_YELLOW = '\x1B[38;5;11m';
const COLOR_ORANGE = '\x1B[38;5;202m';
const COLOR_RED = '\x1B[38;5;9m';

const methodToColor = new Map();
methodToColor.set('POST', COLOR_GREEN);
methodToColor.set('GET', COLOR_BLUE);
methodToColor.set('PUT', COLOR_YELLOW);
methodToColor.set('PATCH', COLOR_ORANGE);
methodToColor.set('DELETE', COLOR_RED);

const logger = (app: Elysia) => app
  .onRequest(({ request }) => {
    const { method, url } = request;
    const { pathname: path } = new URL(url);
    const color = methodToColor.get(method);

    console.log(`${F_BOLD}${color}${method}${NO_FORMAT} ${path}`);
  });

export default logger;
