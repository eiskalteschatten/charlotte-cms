import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import StoryCategoryService from '@/services/StoryCategoryService';
import StoryIndexPageService from '@/services/StoryIndexPageService';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const storyCategoryService = new StoryCategoryService();
    const categories = await storyCategoryService.getCategoriesForIndexPage();

    return reply.view('categories/index.ejs', {
      title: 'Categories',
      mainNavId: 'categories',
      categories,
    });
  });

  type CategoryRequest = FastifyRequest<{ Params: { slug: string }; Querystring: { page: string } }>;
  app.get('/:slug', async (req: CategoryRequest, reply: FastifyReply) => {
    const { slug } = req.params;
    const page = Number(req.query.page) || 1;

    const storyCategoryService = new StoryCategoryService();
    const category = await storyCategoryService.getCategoryForCategoryPage(slug);
    const categories = await storyCategoryService.getCategoriesForIndexPage();

    const storyIndexPageService = new StoryIndexPageService();
    const { stories, totalPages } = await storyIndexPageService.getStoriesForCategoryPage(category.id, page);

    return reply.view('categories/category.ejs', {
      title: category.name,
      mainNavId: 'categories',
      category,
      categories,
      stories,
      totalPages,
      currentPage: page,
    });
  });
};
