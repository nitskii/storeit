import Elysia from 'elysia';

const NO_FORMAT = '\x1B[0m';
const F_BOLD = '\x1B[1m';
const COLOR_GREEN = '\x1B[38;5;46m';
const COLOR_BLUE = '\x1B[38;5;33m';
const COLOR_YELLOW = '\x1B[38;5;11m';
const COLOR_ORANGE = '\x1B[38;5;202m';
const COLOR_RED = '\x1B[38;5;9m';
const COLOR_CYAN='\x1B[38;5;51m';

const methodToColor = new Map();

methodToColor.set(  'POST',  COLOR_GREEN);
methodToColor.set(   'GET',   COLOR_BLUE);
methodToColor.set(   'PUT', COLOR_YELLOW);
methodToColor.set( 'PATCH', COLOR_ORANGE);
methodToColor.set('DELETE',    COLOR_RED);

const statusToColor = new Map();

statusToColor.set(200,  COLOR_GREEN);
statusToColor.set(201,  COLOR_GREEN);
statusToColor.set(204,  COLOR_GREEN);
statusToColor.set(302,   COLOR_CYAN);
statusToColor.set(304,   COLOR_CYAN);
statusToColor.set(400, COLOR_ORANGE);
statusToColor.set(401, COLOR_ORANGE);
statusToColor.set(404, COLOR_ORANGE);
statusToColor.set(409, COLOR_ORANGE);
statusToColor.set(500,    COLOR_RED);

const MAX_METHOD_LENGTH = 6;
const MAX_PATH_LENGTH = 25;

const logger = new Elysia({ name: 'logger' })
  .onResponse(({ request: { method }, path, set: { status } }) => {
    const methodColor = methodToColor.get(method);
    const statusColor = statusToColor.get(status);

    const result = 
      `${F_BOLD}${methodColor}${method}${NO_FORMAT}${' '.repeat(MAX_METHOD_LENGTH - method.length)}` +
      ` ${path} ${' '.repeat(MAX_PATH_LENGTH - path.length)} - ` + 
      `${F_BOLD}${statusColor}${status}${NO_FORMAT}`;

    console.log(result);
  });

export default logger;
