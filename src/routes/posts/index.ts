import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import logger from '@/lib/logger';
import PostService from '@/services/PostService';
import PostCommentService from '@/services/PostCommentService';
import PostCategoryService from '@/services/PostCategoryService';
import PostRatingService from '@/services/PostRatingService';
import PostIndexPageService from '@/services/PostIndexPageService';
import { FrontendScript } from '@/interfaces/routes';

export default async (app: FastifyInstance) => {
  type PaginationRequest = FastifyRequest<{ Querystring: { page: string } }>;
  app.get('/', async (req: PaginationRequest, reply: FastifyReply) => {
    const page = Number(req.query.page) || 1;

    const postIndexPageService = new PostIndexPageService();
    const { posts, totalPages } = await postIndexPageService.getPublishedPostsForIndexPage(page);

    const postCategoryService = new PostCategoryService();
    const categories = await postCategoryService.getCategoriesForIndexPage();

    return reply.view('posts/index.ejs', {
      title: 'Browse Posts',
      mainNavId: 'browse',
      posts,
      currentPage: page,
      totalPages,
      categories,
    });
  });

  type PostRequest = FastifyRequest<{ Params: { slug: string }; Querystring: { preview?: string } }>;
  app.get('/:slug', async (req: PostRequest, reply: FastifyReply) => {
    const { slug } = req.params;
    const { preview } = req.query;
    const postService = new PostService();
    const post = await postService.getPostForPostPage(slug, req.session.get('user')?.id, preview === 'true');

    return reply.view('posts/post.ejs', {
      title: post.title,
      post,
      scripts: [
        { name: reply.locals.webpackManifest['post.js'], loadingMethod: 'async' },
      ] as FrontendScript[],
    });
  });

  type UpdatePostViewRequest = FastifyRequest<{ Body: { postId: string } }>;
  app.put('/views/update', { onRequest: app.csrfProtection }, async (req: UpdatePostViewRequest, reply: FastifyReply) => {
    const postId = Number(req.body.postId);
    const postService = new PostService();
    await postService.addViewToPost(postId);
    return reply.status(201).send();
  });

  type UpdatePostRatingRequest = FastifyRequest<{ Body: { postId: number; rating: number } }>;
  app.post('/ratings/add', { onRequest: app.csrfProtection }, async (req: UpdatePostRatingRequest, reply: FastifyReply) => {
    const postId = Number(req.body.postId);
    const rating = Number(req.body.rating);
    let averageRating: number;

    if (!req.session.get('user')?.id) {
      return reply.status(401).send('Unauthorized');
    }

    try {
      const postRatingService = new PostRatingService();
      averageRating = await postRatingService.addRatingToPost(postId, rating, req.session.get('user').id);
    }
    catch (error) {
      logger.error(error);
      return reply.status(500).send();
    }

    return reply.send({ averageRating });
  });

  type PostCommentRequest = FastifyRequest<{ Params: { slug: string }; Body: { comment: string; postId: number } }>;
  app.post('/:slug/comments/post', { onRequest: app.csrfProtection }, async (req: PostCommentRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.redirect('/auth/login');
    }

    const { slug } = req.params;
    const { postId, comment } = req.body;

    const postCommentService = new PostCommentService();
    await postCommentService.saveComment(postId, comment, req.session.get('user').id);

    return reply.redirect(`/posts/${slug}#comments`);
  });
};
