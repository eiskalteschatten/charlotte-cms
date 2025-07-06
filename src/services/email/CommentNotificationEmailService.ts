import AbstractEmailService from './AbstractEmailService';

export interface EmailData {
  postTitle: string;
  postLink: string;
}

export default class CommentNotificationEmailService extends AbstractEmailService {
  override generateBody(emailData: EmailData): string {
    return `<html>
      <body>
        <p>
          Someone just commented on <a href="${emailData.postLink}">${emailData.postTitle}</a>
        </p>
      </body>
    </html>`;
  }
}
