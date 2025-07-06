import { FastifyInstance, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import UserService from '@/services/UserService';
import logger from '@/lib/logger';

export default fastifyPlugin(function(fastify: FastifyInstance, options: Record<string, any>, done: () => void): void {
  fastify.decorateRequest('isAuthenticated', function (this: FastifyRequest): boolean {
    return !!this.session.get('user');
  });

  fastify.decorateRequest('isUnauthenticated', function (this: FastifyRequest): boolean {
    return !this.session.get('user');
  });

  type LoginRequest = FastifyRequest<{ Body: { username: string; password: string } }>;
  fastify.decorateRequest('login', async function (this: LoginRequest): Promise<boolean> {
    try {
      const userService = new UserService();
      const user = await userService.login(this.body.username, this.body.password);

      if (!user) {
        return false;
      }

      this.session.regenerate();
      this.session.set('user', user);

      return true;
    }
    catch (error) {
      logger.error('Login failed:', error);
      return false;
    }

    return false;
  });

  fastify.decorateRequest('logout', function (this: FastifyRequest): void {
    this.session.regenerate();
  });

  done();
});
