import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import UserService from '@/services/UserService';
import type { UserRegistration } from '@/interfaces/users';

export default async (app: FastifyInstance) => {
  app.get('/', (req: FastifyRequest, reply: FastifyReply) => {
    reply.redirect('/auth/login');
  });

  type LoginRequest = FastifyRequest<{ Querystring: { verificationEmailSent?: string; accountActivated?: string } }>;
  app.get('/login', (req: LoginRequest, reply: FastifyReply) => {
    if (req.isAuthenticated()) {
      reply.redirect('/');
      return;
    }

    let successMessage: string;

    if (req.query.verificationEmailSent === 'true') {
      successMessage = 'Your account has successfully been created. Please verify your email address by clicking on the link in the email we just sent you before you can log in.';
    }
    else if (req.query.accountActivated === 'true') {
      successMessage = 'Your account has successfully been activated. You can now log in with the username and password you chose during the registration process.';
    }

    reply.view('auth/login.ejs', {
      title: 'Login',
      mainNavId: 'login',
      successMessage,
    });
  });

  app.post('/login', { onRequest: app.csrfProtection }, async (req: LoginRequest, reply: FastifyReply) => {
    const loggedIn = await req.login();

    if (!loggedIn) {
      return reply.view('auth/login.ejs', {
        title: 'Login',
        mainNavId: 'login',
        error: 'Invalid username or password!',
      });
    }

    return reply.redirect('/');
  });

  app.get('/register', (req: FastifyRequest, reply: FastifyReply) => {
    if (req.isAuthenticated()) {
      reply.redirect('/');
      return;
    }

    reply.view('auth/register.ejs', {
      title: 'Create an Account',
      mainNavId: 'register',
    });
  });

  app.post('/register', { onRequest: app.csrfProtection }, async (req: FastifyRequest, reply: FastifyReply) => {
    const registrationData = req.body as UserRegistration;

    try {
      const userService = new UserService();
      await userService.register(registrationData);
      return reply.redirect('/auth/login/?verificationEmailSent=true');
    }
    catch (error) {
      return reply.view('auth/register.ejs', {
        title: 'Create an Account',
        mainNavId: 'register',
        error: error.message,
      });
    }
  });

  app.get('/logout', (req: FastifyRequest, reply: FastifyReply) => {
    req.logout();
    reply.redirect('/auth/login');
  });
};
