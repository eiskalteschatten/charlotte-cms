import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import PostCategoryService from '@/services/PostCategoryService';
import PostIndexPageService from '@/services/PostIndexPageService';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const postCategoryService = new PostCategoryService();
    const categories = await postCategoryService.getCategoriesForIndexPage();

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

    const postCategoryService = new PostCategoryService();
    const category = await postCategoryService.getCategoryForCategoryPage(slug);
    const categories = await postCategoryService.getCategoriesForIndexPage();

    const postIndexPageService = new PostIndexPageService();
    const { posts, totalPages } = await postIndexPageService.getPostsForCategoryPage(category.id, page);

    return reply.view('categories/category.ejs', {
      title: category.name,
      mainNavId: 'categories',
      category,
      categories,
      posts,
      totalPages,
      currentPage: page,
    });
  });
};
