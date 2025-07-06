import AbstractEmailService from './AbstractEmailService';

export interface EmailData {
  postTitle: string;
  postLink: string;
}

export default class RatingNotificationEmailService extends AbstractEmailService {
  override generateBody(emailData: EmailData): string {
    return `<html>
      <body>
        <p>
          Someone just rated <a href="${emailData.postLink}">${emailData.postTitle}</a>
        </p>
      </body>
    </html>`;
  }
}
