import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import PostCommentService from '@/services/PostCommentService';
import PostRatingService from '@/services/PostRatingService';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.status(401).send('Unauthorized');
    }

    const postCommentService = new PostCommentService();
    const comments = await postCommentService.getCommentsForUser(req.session.get('user').id);

    const postRatingService = new PostRatingService();
    const ratings = await postRatingService.getRatingsForUser(req.session.get('user').id);

    return reply.view('account/ratings-comments/index.ejs', {
      title: 'My Ratings and Comments',
      sidebarMenuId: 'myRatingsAndComments',
      comments,
      ratings,
    });
  });
};
