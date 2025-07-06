import { Post } from './posts';

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  status: UserStatus;
  verificationCode: string;
  bio?: string;
  links?: UserLinks;
  posts: Post[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInfoUpdate {
  email: string;
}

export interface UserProfileUpdate extends UserLinks {
  bio: string;
}

export interface UserRegistration extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  confirmPassword: string;
}

export interface ChangePasswordData {
  newPassword: string;
  currentPassword: string;
}

export enum UserStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  UNVERIFIED = 'unverified',
}

export enum UserRole {
  AUTHOR = 'author',
  MODERATOR = 'moderator',
  SUPER_ADMIN = 'super_admin',
}

export interface UserLinks {
  website?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  mastodon?: string;
  bluesky?: string;
}

export type SessionUser =  {
  id: number;
  email: string;
  username: string;
};
