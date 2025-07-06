import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import logger from '@/lib/logger';
import StoryService from '@/services/PostService';
import StoryCommentService from '@/services/PostCommentService';
import StoryCategoryService from '@/services/PostCategoryService';
import StoryRatingService from '@/services/PostRatingService';
import StoryIndexPageService from '@/services/PostIndexPageService';
import { FrontendScript } from '@/interfaces/routes';

export default async (app: FastifyInstance) => {
  type PaginationRequest = FastifyRequest<{ Querystring: { page: string } }>;
  app.get('/', async (req: PaginationRequest, reply: FastifyReply) => {
    const page = Number(req.query.page) || 1;

    const storyIndexPageService = new StoryIndexPageService();
    const { stories, totalPages } = await storyIndexPageService.getPublishedStoriesForIndexPage(page);

    const storyCategoryService = new StoryCategoryService();
    const categories = await storyCategoryService.getCategoriesForIndexPage();

    return reply.view('stories/index.ejs', {
      title: 'Browse Stories',
      mainNavId: 'browse',
      stories,
      currentPage: page,
      totalPages,
      categories,
    });
  });

  type StoryRequest = FastifyRequest<{ Params: { slug: string }; Querystring: { preview?: string } }>;
  app.get('/:slug', async (req: StoryRequest, reply: FastifyReply) => {
    const { slug } = req.params;
    const { preview } = req.query;
    const storyService = new StoryService();
    const story = await storyService.getStoryForStoryPage(slug, req.session.get('user')?.id, preview === 'true');

    return reply.view('stories/story.ejs', {
      title: story.title,
      story,
      scripts: [
        { name: reply.locals.webpackManifest['story.js'], loadingMethod: 'async' },
      ] as FrontendScript[],
    });
  });

  type UpdateStoryViewRequest = FastifyRequest<{ Body: { storyId: string } }>;
  app.put('/views/update', { onRequest: app.csrfProtection }, async (req: UpdateStoryViewRequest, reply: FastifyReply) => {
    const storyId = Number(req.body.storyId);
    const storyService = new StoryService();
    await storyService.addViewToStory(storyId);
    return reply.status(201).send();
  });

  type UpdateStoryRatingRequest = FastifyRequest<{ Body: { storyId: number; rating: number } }>;
  app.post('/ratings/add', { onRequest: app.csrfProtection }, async (req: UpdateStoryRatingRequest, reply: FastifyReply) => {
    const storyId = Number(req.body.storyId);
    const rating = Number(req.body.rating);
    let averageRating: number;

    if (!req.session.get('user')?.id) {
      return reply.status(401).send('Unauthorized');
    }

    try {
      const storyRatingService = new StoryRatingService();
      averageRating = await storyRatingService.addRatingToStory(storyId, rating, req.session.get('user').id);
    }
    catch (error) {
      logger.error(error);
      return reply.status(500).send();
    }

    return reply.send({ averageRating });
  });

  type PostCommentRequest = FastifyRequest<{ Params: { slug: string }; Body: { comment: string; storyId: number } }>;
  app.post('/:slug/comments/post', { onRequest: app.csrfProtection }, async (req: PostCommentRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.redirect('/auth/login');
    }

    const { slug } = req.params;
    const { storyId, comment } = req.body;

    const storyCommentService = new StoryCommentService();
    await storyCommentService.saveComment(storyId, comment, req.session.get('user').id);

    return reply.redirect(`/stories/${slug}#comments`);
  });
};
