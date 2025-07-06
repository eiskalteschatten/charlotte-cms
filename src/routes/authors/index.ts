import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import UserService from '@/services/UserService';
import { UserStatus } from '@/interfaces/users';
import StoryIndexPageService from '@/services/PostIndexPageService';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.redirect('/stories/');
  });

  type ProfilePageRequest = FastifyRequest<{ Params: { username: string }; Querystring: { page?: string } }>;
  app.get('/:username', async (req: ProfilePageRequest, reply: FastifyReply) => {
    const { username } = req.params;
    const page = Number(req.query.page) || 1;

    const userProfile = await UserService.getUserProfile(username);

    if (!userProfile || userProfile.status !== UserStatus.ACTIVE) {
      return reply.callNotFound();
    }

    const storyIndexPageService = new StoryIndexPageService();
    const { stories, totalPages } = await storyIndexPageService.getPublishedStoriesForUserProfilePage(userProfile.id, page);

    return reply.view('authors/index.ejs', {
      title: userProfile.username,
      userProfile,
      currentPage: page,
      stories,
      totalPages,
    });
  });
};
