import { User } from './users';

export interface Story {
  id: number;
  title: string;
  content: string;
  shortDescription: string;
  openForComments: boolean;
  openForRatings: boolean;
  noteToAdmin?: string;
  status: StoryStatus;
  isErotic: boolean;
  submissionAgreement: boolean;
  slug: string;
  views: number;
  publishedAt?: Date;
  fkUser: number;
  user: User;
  categories: StoryCategory[];
  tags: StoryTag[];
  ratings: StoryRating[];
  comments: StoryComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryWithAverageRating extends Story {
  averageRating: number;
}

export interface StoriesForIndexPage {
  stories: StoryWithAverageRating[];
  totalPages: number;
}

export interface StoryForStoryPage extends StoryWithAverageRating {
  renderedStory: string;
}

export interface EditStory {
  id?: number;
  title: string;
  content: string;
  shortDescription: string;
  tags: string;
  categories: number[];
  openForComments: boolean;
  openForRatings: boolean;
  noteToAdmin?: string;
  status: string;
  slug?: string;
  isErotic: boolean;
  submissionAgreement: boolean;
  publishedAt?: Date;
}

export interface StoryRating {
  id: number;
  rating: number;
  fkStory: number;
  story: Story;
  fkUser: number;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryTag {
  id: number;
  tag: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryTagWithStoryCount extends StoryTag {
  storyCount: number;
}

export interface StoryCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoryCategoryWithStoryCount extends StoryCategory {
  storyCount: number;
}

export enum StoryStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
  TAKEN_DOWN = 'taken_down',
}

export interface StoryComment {
  id: number;
  comment: string;
  fkStory: number;
  story: Story;
  fkUser: number;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
