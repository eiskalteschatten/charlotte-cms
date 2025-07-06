import { User } from './users';

export interface Post {
  id: number;
  title: string;
  content: string;
  shortDescription: string;
  openForComments: boolean;
  openForRatings: boolean;
  status: PostStatus;
  slug: string;
  views: number;
  publishedAt?: Date;
  fkUser: number;
  user: User;
  categories: PostCategory[];
  tags: PostTag[];
  ratings: PostRating[];
  comments: PostComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PostWithAverageRating extends Post {
  averageRating: number;
}

export interface PostsForIndexPage {
  posts: PostWithAverageRating[];
  totalPages: number;
}

export interface PostForPostPage extends PostWithAverageRating {
  renderedPost: string;
}

export interface EditPost {
  id?: number;
  title: string;
  content: string;
  shortDescription: string;
  tags: string;
  categories: number[];
  openForComments: boolean;
  openForRatings: boolean;
  status: string;
  slug?: string;
  publishedAt?: Date;
}

export interface PostRating {
  id: number;
  rating: number;
  fkPost: number;
  post: Post;
  fkUser: number;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostTag {
  id: number;
  tag: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostTagWithPostCount extends PostTag {
  postCount: number;
}

export interface PostCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostCategoryWithPostCount extends PostCategory {
  postCount: number;
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export interface PostComment {
  id: number;
  comment: string;
  fkPost: number;
  post: Post;
  fkUser: number;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
