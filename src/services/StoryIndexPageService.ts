import { WhereOptions } from 'sequelize';

import Story from '@/db/models/Post';
import StoryTag from '@/db/models/PostTag';
import StoryComment from '@/db/models/PostComment';
import StoryRating from '@/db/models/PostRating';
import StoryCategory from '@/db/models/PostCategory';
import User from '@/db/models/User';
import { StoriesForIndexPage, StoryStatus } from '@/interfaces/posts';

import StoryRatingService from './StoryRatingService';

export default class StoryIndexPageService {
  private readonly storyIndexLimit = 20;

  private readonly indexPageIncludesForBlocks = [
    {
      model: StoryComment,
      as: 'comments',
      attributes: ['id'],
    },
    {
      model: StoryCategory,
      as: 'categories',
      attributes: ['id', 'name', 'slug'],
    },
    {
      model: StoryRating,
      as: 'ratings',
      attributes: ['rating'],
    },
    {
      model: User,
      as: 'user',
      attributes: ['username'],
    },
  ];

  private async addDataForIndexPage(stories: Story[], where?: WhereOptions): Promise<StoriesForIndexPage> {
    return {
      stories: stories.length > 0 ? stories.map(story => ({
        ...story.toJSON(),
        averageRating: StoryRatingService.getAverageRating(story),
      })) : [],
      totalPages: await this.getTotalPages(where),
    };
  }

  private async getTotalPages(where?: WhereOptions): Promise<number> {
    const storyCount = await Story.count({ where });
    return Math.ceil(storyCount / this.storyIndexLimit);
  }

  private getOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  async getStoriesForMyStories(userId: number, page = 1): Promise<StoriesForIndexPage> {
    const where: WhereOptions = {
      fkUser: userId,
    };

    const stories = await Story.findAll({
      where,
      offset: this.getOffset(page, this.storyIndexLimit),
      limit: this.storyIndexLimit,
      order: [['title', 'ASC']],
      include: [
        {
          model: StoryComment,
          as: 'comments',
          attributes: ['id'],
        },
        {
          model: StoryCategory,
          as: 'categories',
          attributes: ['id', 'name', 'slug'],
        },
        {
          model: StoryRating,
          as: 'ratings',
          attributes: ['rating'],
        },
      ],
    });

    return this.addDataForIndexPage(stories, where);
  }

  async getPublishedStoriesForIndexPage(page = 1, limit = this.storyIndexLimit): Promise<StoriesForIndexPage> {
    const where: WhereOptions = {
      status: StoryStatus.PUBLISHED,
    };

    const stories = await Story.findAll({
      where,
      offset: this.getOffset(page, limit),
      limit,
      order: [['publishedAt', 'DESC'], ['title', 'ASC']],
      include: this.indexPageIncludesForBlocks,
    });

    return this.addDataForIndexPage(stories, where);
  }

  async getMostPopularStoriesForIndexPage(page = 1, limit = this.storyIndexLimit): Promise<StoriesForIndexPage> {
    const where: WhereOptions = {
      status: StoryStatus.PUBLISHED,
    };

    const stories = await Story.findAll({
      where,
      offset: this.getOffset(page, limit),
      limit,
      order: [['views', 'DESC']],
      include: this.indexPageIncludesForBlocks,
    });

    return this.addDataForIndexPage(stories, where);
  }

  async getPublishedStoriesForUserProfilePage(userId: number, page = 1): Promise<StoriesForIndexPage> {
    const where: WhereOptions = {
      status: StoryStatus.PUBLISHED,
      fkUser: userId,
    };

    const stories = await Story.findAll({
      where,
      offset: this.getOffset(page, this.storyIndexLimit),
      limit: this.storyIndexLimit,
      order: [['publishedAt', 'DESC'], ['title', 'ASC']],
      include: this.indexPageIncludesForBlocks,
    });

    return this.addDataForIndexPage(stories, where);
  }

  async getStoriesForCategoryPage(categoryId: number, page = 1): Promise<StoriesForIndexPage> {
    const stories = await Story.findAll({
      where: {
        status: StoryStatus.PUBLISHED,
      },
      include: [
        {
          model: StoryComment,
          as: 'comments',
          attributes: ['id'],
        },
        {
          model: StoryCategory,
          as: 'categories',
          attributes: ['id', 'name', 'slug'],
          where: { id: categoryId },
        },
        {
          model: StoryRating,
          as: 'ratings',
          attributes: ['rating'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['username'],
        },
      ],
      offset: this.getOffset(page, this.storyIndexLimit),
      limit: this.storyIndexLimit,
      order: [['title', 'ASC']],
    });

    const storiesWithAllCategories = [];

    for (const story of stories) {
      // TypeScript doesn't recognize the methods added to models by associations
      const storyCategories = await (story as any).getCategories();

      if (storyCategories.length > 0) {
        storiesWithAllCategories.push({
          ...story.toJSON(),
          categories: storyCategories,
          averageRating: StoryRatingService.getAverageRating(story),
        });
      }
    }

    const numberOfStories = await Story.count({
      include: [
        {
          model: StoryCategory,
          as: 'categories',
          where: { id: categoryId },
          attributes: ['id'],
        },
      ],
    });

    return {
      stories: storiesWithAllCategories,
      totalPages: Math.ceil(numberOfStories / this.storyIndexLimit),
    };
  }

  async getStoriesForTagPage(tagId: number, page = 1): Promise<StoriesForIndexPage> {
    const stories = await Story.findAll({
      where: {
        status: StoryStatus.PUBLISHED,
      },
      include: [
        ...this.indexPageIncludesForBlocks,
        {
          model: StoryTag,
          as: 'tags',
          where: { id: tagId },
        },
      ],
      offset: this.getOffset(page, this.storyIndexLimit),
      limit: this.storyIndexLimit,
      order: [['title', 'ASC']],
    });

    const numberOfStories = await Story.count({
      include: [
        {
          model: StoryTag,
          as: 'tags',
          where: { id: tagId },
          attributes: ['id'],
        },
      ],
    });

    return {
      stories: stories.map(story => ({
        ...story.toJSON(),
        averageRating: StoryRatingService.getAverageRating(story),
      })),
      totalPages: Math.ceil(numberOfStories / this.storyIndexLimit),
    };
  }
}
