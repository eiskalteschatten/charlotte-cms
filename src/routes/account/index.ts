import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { ChangePasswordData, UserInfoUpdate } from '@/interfaces/users';
import UserService from '@/services/UserService';
import { FrontendScript } from '@/interfaces/routes';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.status(401).send('Unauthorized');
    }

    return reply.view('account/index.ejs', {
      title: 'My Account',
      sidebarMenuId: 'myAccount',
      scripts: [
        { name: reply.locals.webpackManifest['account.js'], loadingMethod: 'async' },
      ] as FrontendScript[],
    });
  });

  type UpdateInfoRequest = FastifyRequest<{ Body: UserInfoUpdate }>;
  app.put('/info/update', { onRequest: app.csrfProtection }, async (req: UpdateInfoRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.status(401).send('Unauthorized');
    }

    try {
      const userService = new UserService();
      await userService.init(req.session.get('user').id);
      await userService.updateInfo(req.body);
      req.session.set('user', userService.getSessionUser());
    }
    catch (error) {
      return reply.status(400).send({ error: error.message });
    }

    return reply.status(201).send();
  });

  type UpdatePasswordRequest = FastifyRequest<{ Body: ChangePasswordData }>;
  app.put('/password/update', { onRequest: app.csrfProtection }, async (req: UpdatePasswordRequest, reply: FastifyReply) => {
    if (req.isUnauthenticated()) {
      return reply.status(401).send('Unauthorized');
    }

    try {
      const userService = new UserService();
      await userService.init(req.session.get('user').id);
      await userService.changePassword(req.body.newPassword, req.body.currentPassword);
    }
    catch (error) {
      return reply.status(400).send({ error: error.message });
    }

    return reply.status(201).send();
  });

  type ActivateAccountRequest = FastifyRequest<{ Params: { userId: string; verificationCode: string } }>;
  app.get('/activate/:userId/:verificationCode', async (req: ActivateAccountRequest, reply: FastifyReply) => {
    const userId = Number(req.params.userId);
    const { verificationCode } = req.params;
    await UserService.activateAccount(userId, verificationCode);
    return reply.redirect('/auth/login/?accountActivated=true');
  });
};
