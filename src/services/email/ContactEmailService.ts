import AbstractEmailService from './AbstractEmailService';

export interface EmailData {
  name: string;
  email: string;
  message: string;
}

export default class ContactEmailService extends AbstractEmailService {
  override generateBody(emailData: EmailData): string {
    return `<html>
      <body>
        <p>
          <b>Name:</b> ${emailData.name}<br>
          <b>Email:</b> ${emailData.email}
        </p>
        <p><b>Message:</b></p>
        <p>${emailData.message}</p>
      </body>
    </html>`;
  }
}
