import AbstractEmailService from './AbstractEmailService';

export interface EmailData {
  username: string;
}

export default class RegistrationNotificationEmailService extends AbstractEmailService {
  override generateBody(emailData: EmailData): string {
    return `<html>
      <body>
        <p>
          <b>A new user just registered:</b> ${emailData.username}
        </p>
      </body>
    </html>`;
  }
}
