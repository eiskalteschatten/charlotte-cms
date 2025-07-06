import AbstractEmailService from './AbstractEmailService';

export interface EmailData {
  postTitle: string;
  postLink: string;
}

export default class PublicationNotificationEmailService extends AbstractEmailService {
  override generateBody(emailData: EmailData): string {
    return `<html>
      <body>
        <p>
          <b>A new post was just published:</b> <a href="${emailData.postLink}">${emailData.postTitle}</a>
        </p>
      </body>
    </html>`;
  }
}
