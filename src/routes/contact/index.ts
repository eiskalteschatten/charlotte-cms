import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import logger from '@/lib/logger';
import ContactEmailService, { EmailData } from '@/services/email/ContactEmailService';

export default async (app: FastifyInstance) => {
  app.get('/', (req: FastifyRequest, reply: FastifyReply) => {
    reply.view('contact.ejs', {
      title: 'Contact',
    });
  });

  type ContactFormRequest = FastifyRequest<{ Body: EmailData }>;
  app.post('/', { onRequest: app.csrfProtection }, async (req: ContactFormRequest, reply: FastifyReply) => {
    try {
      const contactEmailService = new ContactEmailService();

      await contactEmailService.sendMail<EmailData>({
        to: 'tflabs@outlook.de',
        subject: 'Email from TF Storytime',
        emailData: req.body,
      });

      return reply.view('contact.ejs', {
        title: 'Contact',
        success: true,
      });
    }
    catch (error) {
      logger.error(error);

      return reply.view('contact.ejs', {
        title: 'Contact',
        error: true,
      });
    }
  });
};
