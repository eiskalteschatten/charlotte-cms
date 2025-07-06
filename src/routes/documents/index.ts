import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async (app: FastifyInstance) => {
  app.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.view('documents/index.ejs', {
      title: 'Documents and Guidelines',
    });
  });

  app.get('/imprint', async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.view('documents/imprint.ejs', {
      title: 'Imprint',
    });
  });

  app.get('/privacy-statement', async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.view('documents/privacy-statement.ejs', {
      title: 'Privacy Statement',
    });
  });

  app.get('/terms-of-service', async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.view('documents/terms-of-service.ejs', {
      title: 'Terms of Service',
    });
  });

  app.get('/content-guidelines', async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.view('documents/content-guidelines.ejs', {
      title: 'Content Guidelines',
    });
  });

  app.get('/submission-guidelines', async (req: FastifyRequest, reply: FastifyReply) => {
    return reply.view('documents/submission-guidelines.ejs', {
      title: 'Submission Guidelines',
    });
  });
};
