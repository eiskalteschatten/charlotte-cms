import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { EditPost } from '@/interfaces/posts';
import PostService from '@/services/PostService';
import logger from '@/lib/logger';
import Post from '@/db/models/Post';
import PostCategoryService from '@/services/PostCategoryService';
import PostTagService from '@/services/PostTagService';
import PostIndexPageService from '@/services/PostIndexPageService';
import { FrontendScript } from '@/interfaces/routes';

export default async (app: FastifyInstance) => {
  type PaginationRequest = FastifyRequest<{ Querystring: { page: string } }>;
  app.get('/', async (req: PaginationRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.redirect('/auth/login');
    }

    const page = Number(req.query.page) || 1;
    const postIndexPageService = new PostIndexPageService();
    const { posts, totalPages } = await postIndexPageService.getPostsForMyPosts(req.session.get('user').id, page);

    return reply.view('account/posts/index.ejs', {
      title: 'My Posts',
      sidebarMenuId: 'myPosts',
      posts,
      currentPage: page,
      totalPages,
    });
  });

  app.get('/submit', async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.redirect('/auth/register');
    }

    const postCategoryService = new PostCategoryService();
    const categories = await postCategoryService.getCategoriesForEditPostPage();

    return reply.view('account/posts/editPost.ejs', {
      title: 'Submit a Post',
      categories,
      scripts: [
        { name: reply.locals.webpackManifest['editPost.js'], loadingMethod: 'async' },
      ] as FrontendScript[],
    });
  });

  app.get('/edit', (req: FastifyRequest, reply: FastifyReply) => {
    return reply.redirect('/account/posts/submit');
  });

  app.get('/edit/tags', async (req: FastifyRequest, reply: FastifyReply) => {
    const postTagService = new PostTagService();
    const tags = await postTagService.getTagsForEditPostPage();
    return reply.send(tags.map(({ tag }) => tag));
  });

  type EditRequest = FastifyRequest<{ Params: { postId: string } }>;
  app.get('/edit/:postId', async (req: EditRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.redirect('/auth/login');
    }

    const postId = Number(req.params.postId);
    const postService = new PostService();
    const post = await postService.getPostForEditing(postId, req.session.get('user').id);
    const tags = post.tags.map(tag => tag.tag).join(', ');

    const postCategoryService = new PostCategoryService();
    const categories = await postCategoryService.getCategoriesForEditPostPage();

    return reply.view('account/posts/editPost.ejs', {
      title: `Edit ${post.title}`,
      post,
      tags,
      categories,
      sidebarMenuId: 'myPosts',
      scripts: [
        { name: reply.locals.webpackManifest['editPost.js'], loadingMethod: 'async' },
      ] as FrontendScript[],
    });
  });

  type SaveRequest = FastifyRequest<{ Body: EditPost }>;
  app.post('/save', { onRequest: app.csrfProtection }, async (req: SaveRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.status(401).send('Unauthorized');
    }

    let post: Post;

    try {
      const postService = new PostService();
      post = await postService.savePost(req.body, req.session.get('user').id);
    }
    catch (error) {
      logger.error(error);
      return reply.status(500).send('An error occurred while saving the post.');
    }

    return reply.send(post);
  });

  type DeleteRequest = FastifyRequest<{ Params: { postId: string } }>;
  app.delete('/delete/:postId', async (req: DeleteRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.status(401).send('Unauthorized');
    }

    const postId = Number(req.params.postId);

    try {
      const postService = new PostService();
      await postService.deletePost(postId, req.session.get('user').id);
    }
    catch (error) {
      logger.error(error);
      return reply.status(500).send('An error occurred while deleting the post.');
    }

    return reply.status(201).send();
  });
};
