import { SentMessageInfo } from 'nodemailer';

import mailTransporter from '@/lib/mailTransporter';
import logger from '@/lib/logger';

export interface SendEmailOptions<T> {
  to: string;
  subject: string;
  emailData: T;
}

export default abstract class AbstractEmailService {
  abstract generateBody(emailData: any): string;

  async sendMail<T>(sendEmailOptions: SendEmailOptions<T>): Promise<SentMessageInfo> {
    try {
      await mailTransporter.verify();
      logger.info('Server is ready to take our messages');

      const options = {
        from: process.env.EMAIL_FROM,
        to: sendEmailOptions.to,
        subject: sendEmailOptions.subject,
        html: this.generateBody(sendEmailOptions.emailData),
      };

      const info = await mailTransporter.sendMail(options);
      logger.info('Message sent: %s', info.messageId);
      return info;
    }
    catch (error) {
      logger.error('Error sending email:', error);
    }
  }
}
