import html from '@elysiajs/html';
import Elysia from 'elysia';
import { authentication } from '../middleware';
import tagService from '../services/tag-service';

const tagRoutes = async (app: Elysia) => app
  .group('/api', app => app
    .use(authentication)
    .use(html())
    .get('/tags', async ({ userId }) => {
      const tags = await tagService.getAllForUser(userId);

      return tags
        .map(({ name }) => <option>{name}</option>)
        .join('');
    })
  );

export default tagRoutes;
