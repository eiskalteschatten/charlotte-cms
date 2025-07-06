import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import StoryTagService from '@/services/StoryTagService';
import StoryCategoryService from '@/services/StoryCategoryService';
import { StoriesForIndexPage } from '@/interfaces/stories';
import { getSlugFromString } from '@/lib/helpers';
import StoryIndexPageService from '@/services/StoryIndexPageService';
import { FrontendScript } from '@/interfaces/routes';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const storyTagService = new StoryTagService();
    const tags = await storyTagService.getTagsForIndexPage();

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

    const storyCategoryService = new StoryCategoryService();
    const categories = await storyCategoryService.getCategoriesForIndexPage();

    const storyTagService = new StoryTagService();
    const tag = await storyTagService.getTagForTagPage(slug);
    const tags = await storyTagService.getTagsForIndexPage();

    let storiesForIndexPage: StoriesForIndexPage;

    if (tag) {
      const storyIndexPageService = new StoryIndexPageService();
      storiesForIndexPage = await storyIndexPageService.getStoriesForTagPage(tag.id, page);
    }

    return reply.view('tags/tag.ejs', {
      title: tag?.tag ?? slug,
      mainNavId: 'tags',
      tag,
      tags,
      stories: storiesForIndexPage?.stories ?? [],
      totalPages: storiesForIndexPage?.totalPages ?? 0,
      currentPage: page,
      categories,
    });
  });
};
