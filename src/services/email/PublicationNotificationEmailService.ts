import AbstractEmailService from './AbstractEmailService';

export interface EmailData {
  storyTitle: string;
  storyLink: string;
}

export default class PublicationNotificationEmailService extends AbstractEmailService {
  override generateBody(emailData: EmailData): string {
    return `<html>
      <body>
        <p>
          <b>A new story was just published:</b> <a href="${emailData.storyLink}">${emailData.storyTitle}</a>
        </p>
      </body>
    </html>`;
  }
}
