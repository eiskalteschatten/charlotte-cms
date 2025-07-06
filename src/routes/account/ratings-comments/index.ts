import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import StoryCommentService from '@/services/PostCommentService';
import StoryRatingService from '@/services/PostRatingService';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.status(401).send('Unauthorized');
    }

    const storyCommentService = new StoryCommentService();
    const comments = await storyCommentService.getCommentsForUser(req.session.get('user').id);

    const storyRatingService = new StoryRatingService();
    const ratings = await storyRatingService.getRatingsForUser(req.session.get('user').id);

    return reply.view('account/ratings-comments/index.ejs', {
      title: 'My Ratings and Comments',
      sidebarMenuId: 'myRatingsAndComments',
      comments,
      ratings,
    });
  });
};
