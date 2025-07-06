import AbstractEmailService from './AbstractEmailService';

export interface EmailData {
  storyTitle: string;
  storyLink: string;
}

export default class CommentNotificationEmailService extends AbstractEmailService {
  override generateBody(emailData: EmailData): string {
    return `<html>
      <body>
        <p>
          Someone just commented on <a href="${emailData.storyLink}">${emailData.storyTitle}</a>
        </p>
      </body>
    </html>`;
  }
}
