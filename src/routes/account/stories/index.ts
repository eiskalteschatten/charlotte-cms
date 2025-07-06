import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { EditStory } from '@/interfaces/posts';
import StoryService from '@/services/StoryService';
import logger from '@/lib/logger';
import Story from '@/db/models/Post';
import StoryCategoryService from '@/services/StoryCategoryService';
import StoryTagService from '@/services/StoryTagService';
import StoryIndexPageService from '@/services/StoryIndexPageService';
import { FrontendScript } from '@/interfaces/routes';

export default async (app: FastifyInstance) => {
  type PaginationRequest = FastifyRequest<{ Querystring: { page: string } }>;
  app.get('/', async (req: PaginationRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.redirect('/auth/login');
    }

    const page = Number(req.query.page) || 1;
    const storyIndexPageService = new StoryIndexPageService();
    const { stories, totalPages } = await storyIndexPageService.getStoriesForMyStories(req.session.get('user').id, page);

    return reply.view('account/stories/index.ejs', {
      title: 'My Stories',
      sidebarMenuId: 'myStories',
      stories,
      currentPage: page,
      totalPages,
    });
  });

  app.get('/submit', async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.redirect('/auth/register');
    }

    const storyCategoryService = new StoryCategoryService();
    const categories = await storyCategoryService.getCategoriesForEditStoryPage();

    return reply.view('account/stories/editStory.ejs', {
      title: 'Submit a Story',
      categories,
      scripts: [
        { name: reply.locals.webpackManifest['editStory.js'], loadingMethod: 'async' },
      ] as FrontendScript[],
    });
  });

  app.get('/edit', (req: FastifyRequest, reply: FastifyReply) => {
    return reply.redirect('/account/stories/submit');
  });

  app.get('/edit/tags', async (req: FastifyRequest, reply: FastifyReply) => {
    const storyTagService = new StoryTagService();
    const tags = await storyTagService.getTagsForEditStoryPage();
    return reply.send(tags.map(({ tag }) => tag));
  });

  type EditRequest = FastifyRequest<{ Params: { storyId: string } }>;
  app.get('/edit/:storyId', async (req: EditRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.redirect('/auth/login');
    }

    const storyId = Number(req.params.storyId);
    const storyService = new StoryService();
    const story = await storyService.getStoryForEditing(storyId, req.session.get('user').id);
    const tags = story.tags.map(tag => tag.tag).join(', ');

    const storyCategoryService = new StoryCategoryService();
    const categories = await storyCategoryService.getCategoriesForEditStoryPage();

    return reply.view('account/stories/editStory.ejs', {
      title: `Edit ${story.title}`,
      story,
      tags,
      categories,
      sidebarMenuId: 'myStories',
      scripts: [
        { name: reply.locals.webpackManifest['editStory.js'], loadingMethod: 'async' },
      ] as FrontendScript[],
    });
  });

  type SaveRequest = FastifyRequest<{ Body: EditStory }>;
  app.post('/save', { onRequest: app.csrfProtection }, async (req: SaveRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.status(401).send('Unauthorized');
    }

    let story: Story;

    try {
      const storyService = new StoryService();
      story = await storyService.saveStory(req.body, req.session.get('user').id);
    }
    catch (error) {
      logger.error(error);
      return reply.status(500).send('An error occurred while saving the story.');
    }

    return reply.send(story);
  });

  type DeleteRequest = FastifyRequest<{ Params: { storyId: string } }>;
  app.delete('/delete/:storyId', async (req: DeleteRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.status(401).send('Unauthorized');
    }

    const storyId = Number(req.params.storyId);

    try {
      const storyService = new StoryService();
      await storyService.deleteStory(storyId, req.session.get('user').id);
    }
    catch (error) {
      logger.error(error);
      return reply.status(500).send('An error occurred while deleting the story.');
    }

    return reply.status(201).send();
  });
};
