import AbstractEmailService from './AbstractEmailService';

export interface EmailData {
  userId: number;
  username: string;
  verificationCode: string;
}

export default class VerificationEmailService extends AbstractEmailService {
  override generateBody(emailData: EmailData): string {
    const verificationLink = `${process.env.APPLICATION_HOST}/account/activate/${emailData.userId}/${emailData.verificationCode}`;

    return `<html>
      <body>
        Hi ${emailData.username},
        <br /><br />
        Welcome to TF Labs! Your account has been successfully set up and is almost ready to use. To complete the registration process, please click the link below to verify your email address. After your email address has been verified, you can log in.
        <br /><br />
        Click here to activate your account:
        <br />
        <a href="${verificationLink}">${verificationLink}</a>
      </body>
    </html>`;
  }
}
