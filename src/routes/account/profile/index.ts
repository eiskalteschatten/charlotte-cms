import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import UserService from '@/services/UserService';
import { UserProfileUpdate } from '@/interfaces/users';
import { FrontendScript } from '@/interfaces/routes';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.status(401).send('Unauthorized');
    }

    const userService = new UserService();
    await userService.init(req.session.get('user').id);

    const profile = {
      bio: userService.user.bio,
      links: userService.user.links,
    };

    return reply.view('account/profile/index.ejs', {
      title: 'My Profile',
      sidebarMenuId: 'myProfile',
      profile,
      scripts: [
        { name: reply.locals.webpackManifest['myProfile.js'], loadingMethod: 'async' },
      ] as FrontendScript[],
    });
  });

  type UpdateProfileRequest = FastifyRequest<{ Body: UserProfileUpdate }>;
  app.put('/update', { onRequest: app.csrfProtection }, async (req: UpdateProfileRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.status(401).send('Unauthorized');
    }

    try {
      const userService = new UserService();
      await userService.init(req.session.get('user').id);
      await userService.updateProfileInfo(req.body);
    }
    catch (error) {
      return reply.status(400).send({ error: error.message });
    }

    return reply.status(201).send();
  });

};
