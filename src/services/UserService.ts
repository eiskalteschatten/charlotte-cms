import sequelize from 'sequelize';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import { SessionUser, UserInfoUpdate, UserProfileUpdate, UserRole, UserStatus, type UserRegistration } from '@/interfaces/users';
import User from '@/db/models/User';

import VerificationEmailService, { EmailData } from './email/VerificationEmailService';
import RegistrationNotificationEmailService, { EmailData as RegistrationNotificationEmailData } from './email/RegistrationNotificationEmailService';

export default class UserService {
  user: User;
  static readonly passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');

  async init(id: number): Promise<void> {
    this.user = await User.findByPk(id);
  }

  async register(registrationData: UserRegistration): Promise<User> {
    const existingUser: User = await User.findOne({
      where: [
        sequelize.where(
          sequelize.fn('lower', sequelize.col('User.username')),
          registrationData.username.toLowerCase()
        ),
        sequelize.where(
          sequelize.fn('lower', sequelize.col('User.email')),
          registrationData.email.toLowerCase()
        ),
      ],
    });

    if (existingUser) {
      throw new Error('A user with this username or email address already exists!');
    }

    if (registrationData.password !== registrationData.confirmPassword) {
      throw new Error('The passwords you entered do not match!');
    }

    if (!registrationData.password.match(UserService.passwordRegex)) {
      throw new Error('The password does not match the schema!');
    }

    const saltRounds = 12;
    const hash = await bcrypt.hash(registrationData.password, saltRounds);

    this.user = await User.create({
      ...registrationData,
      status: UserStatus.UNVERIFIED,
      role: UserRole.AUTHOR,
      password: hash,
      verificationCode: crypto.randomBytes(32).toString('hex'),
    });

    // Don't await these, we don't want to block the response
    this.sendVerificationEmail();
    this.sendRegistrationNotificationEmail();

    return this.user;
  }

  async login(username: string, password: string): Promise<SessionUser> {
    this.user = await User.findOne({ where: { username } });
    const passwordIsValid = await this.validatePassword(password);

    if (!this.user || !passwordIsValid) {
      throw new Error('Invalid username or password!');
    }

    if (this.user.status === UserStatus.UNVERIFIED) {
      throw new Error('You must verify your email address before you can log in!');
    }

    if (this.user.status === UserStatus.DISABLED) {
      throw new Error('Your account has been disabled!');
    }

    return this.getSessionUser();
  }

  private async validatePassword(password: string): Promise<boolean> {
    if (!this.user) {
      return false;
    }

    return bcrypt.compare(password, this.user.password);
  }

  async updateInfo(userInfo: UserInfoUpdate): Promise<User> {
    // if (userInfo.email && userInfo.email !== this.user.email) {
    //  TODO: Send verification email if the email address was changed
    // }

    return this.user.update(userInfo);
  }

  getSessionUser(): SessionUser {
    return {
      id: this.user.id,
      email: this.user.email,
      username: this.user.username,
    };
  }

  async changePassword(newPassword: string, currentPassword: string): Promise<void> {
    const passwordIsValid = await this.validatePassword(currentPassword);

    if (!passwordIsValid) {
      throw new Error('The current password is incorrect!');
    }

    if (!newPassword.match(UserService.passwordRegex)) {
      throw new Error('The password does not match the schema!');
    }

    const saltRounds = 12;
    const hash = await bcrypt.hash(newPassword, saltRounds);

    await this.user.update({ password: hash });
  }

  async updateProfileInfo(userInfo: UserProfileUpdate): Promise<User> {
    return this.user.update({
      bio: userInfo.bio,
      links: {
        website: userInfo.website,
        twitter: userInfo.twitter,
        instagram: userInfo.instagram,
        facebook: userInfo.facebook,
        mastodon: userInfo.mastodon,
        bluesky: userInfo.bluesky,
      },
    });
  }

  private async sendVerificationEmail(): Promise<void> {
    const verificationEmailService = new VerificationEmailService();
    await verificationEmailService.sendMail<EmailData>({
      to: this.user.email,
      subject: 'Welcome to TF Labs! Please verify your email address.',
      emailData: {
        userId: this.user.id,
        username: this.user.username,
        verificationCode: this.user.verificationCode,
      },
    });
  }

  private async sendRegistrationNotificationEmail(): Promise<void> {
    const emailService = new RegistrationNotificationEmailService();
    await emailService.sendMail<RegistrationNotificationEmailData>({
      to: 'tflabs@outlook.de',
      subject: 'New User Registration',
      emailData: {
        username: this.user.username,
      },
    });
  }

  static async activateAccount(userId: number, verificationCode: string): Promise<void> {
    if (!userId || !verificationCode) {
      throw new Error('Invalid activation link!');
    }

    const user = await User.findOne({ where: { id: userId, verificationCode } });

    if (!user) {
      throw new Error('Invalid activation link!');
    }

    await user.update({ status: UserStatus.ACTIVE });
  }

  static async getUserProfile(username: string): Promise<User> {
    return User.findOne({
      where: { username },
      attributes: ['id', 'username', 'status', 'bio', 'links', 'createdAt'],
    });
  }
}
