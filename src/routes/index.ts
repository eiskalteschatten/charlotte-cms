import PostIndexPageService from '@/services/PostIndexPageService';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import PostTagService from '@/services/PostTagService';
import PostCategoryService from '@/services/PostCategoryService';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const postIndexPageService = new PostIndexPageService();
    const { posts: latestPosts } = await postIndexPageService.getPublishedPostsForIndexPage(1, 10);
    const { posts: mostPopuplarPosts } = await postIndexPageService.getMostPopularPostsForIndexPage(1, 10);

    const postTagService = new PostTagService();
    const tags = await postTagService.getMostPopularTagsForIndexPage(35);

    const postCategoryService = new PostCategoryService();
    const categories = await postCategoryService.getCategoriesForIndexPage();

    return reply.view('home.ejs', {
      mainNavId: 'home',
      latestPosts,
      mostPopuplarPosts,
      tags,
      categories,
    });
  });
};
