import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import UserService from '@/services/UserService';
import { UserStatus } from '@/interfaces/users';
import PostIndexPageService from '@/services/PostIndexPageService';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.redirect('/posts/');
  });

  type ProfilePageRequest = FastifyRequest<{ Params: { username: string }; Querystring: { page?: string } }>;
  app.get('/:username', async (req: ProfilePageRequest, reply: FastifyReply) => {
    const { username } = req.params;
    const page = Number(req.query.page) || 1;

    const userProfile = await UserService.getUserProfile(username);

    if (!userProfile || userProfile.status !== UserStatus.ACTIVE) {
      return reply.callNotFound();
    }

    const postIndexPageService = new PostIndexPageService();
    const { posts, totalPages } = await postIndexPageService.getPublishedPostsForUserProfilePage(userProfile.id, page);

    return reply.view('authors/index.ejs', {
      title: userProfile.username,
      userProfile,
      currentPage: page,
      posts,
      totalPages,
    });
  });
};
