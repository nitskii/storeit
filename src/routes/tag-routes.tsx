import html from '@elysiajs/html';
import Elysia from 'elysia';
import { authenticator } from '../plugins';
import tagService from '../services/tag-service';

const tagRoutes = async (app: Elysia) => app
  .group('/api', app => app
    .use(authenticator)
    .use(html())
    .get('/tags', async ({ userId }) => {
      const tags = await tagService.getAllForUser(userId);

      return tags
        .map(({ name }) => <option>{name}</option>)
        .join('');
    })
  );

export default tagRoutes;
