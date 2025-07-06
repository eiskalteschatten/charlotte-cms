import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import PostTagService from '@/services/PostTagService';
import PostCategoryService from '@/services/PostCategoryService';
import { PostsForIndexPage } from '@/interfaces/posts';
import { getSlugFromString } from '@/lib/helpers';
import PostIndexPageService from '@/services/PostIndexPageService';
import { FrontendScript } from '@/interfaces/routes';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const postTagService = new PostTagService();
    const tags = await postTagService.getTagsForIndexPage();

    return reply.view('tags/index.ejs', {
      title: 'Tags',
      mainNavId: 'tags',
      tags,
      scripts: [
        { name: reply.locals.webpackManifest['tags.js'], loadingMethod: 'async' },
      ] as FrontendScript[],
    });
  });

  type TagRequest = FastifyRequest<{ Params: { slug: string }; Querystring: { page: string } }>;
  app.get('/:slug', async (req: TagRequest, reply: FastifyReply) => {
    const slug = getSlugFromString(req.params.slug);
    const page = Number(req.query.page) || 1;

    const postCategoryService = new PostCategoryService();
    const categories = await postCategoryService.getCategoriesForIndexPage();

    const postTagService = new PostTagService();
    const tag = await postTagService.getTagForTagPage(slug);
    const tags = await postTagService.getTagsForIndexPage();

    let postsForIndexPage: PostsForIndexPage;

    if (tag) {
      const postIndexPageService = new PostIndexPageService();
      postsForIndexPage = await postIndexPageService.getPostsForTagPage(tag.id, page);
    }

    return reply.view('tags/tag.ejs', {
      title: tag?.tag ?? slug,
      mainNavId: 'tags',
      tag,
      tags,
      posts: postsForIndexPage?.posts ?? [],
      totalPages: postsForIndexPage?.totalPages ?? 0,
      currentPage: page,
      categories,
    });
  });
};
