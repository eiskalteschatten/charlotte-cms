import StoryIndexPageService from '@/services/StoryIndexPageService';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import StoryTagService from '@/services/StoryTagService';
import StoryCategoryService from '@/services/StoryCategoryService';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const storyIndexPageService = new StoryIndexPageService();
    const { stories: latestStories } = await storyIndexPageService.getPublishedStoriesForIndexPage(1, 10);
    const { stories: mostPopuplarStories } = await storyIndexPageService.getMostPopularStoriesForIndexPage(1, 10);

    const storyTagService = new StoryTagService();
    const tags = await storyTagService.getMostPopularTagsForIndexPage(35);

    const storyCategoryService = new StoryCategoryService();
    const categories = await storyCategoryService.getCategoriesForIndexPage();

    return reply.view('home.ejs', {
      mainNavId: 'home',
      latestStories,
      mostPopuplarStories,
      tags,
      categories,
    });
  });
};
