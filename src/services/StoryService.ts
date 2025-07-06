import Story from '@/db/models/Story';
import StoryTag from '@/db/models/StoryTag';
import StoryComment from '@/db/models/StoryComment';
import StoryRating from '@/db/models/StoryRating';
import StoryCategory from '@/db/models/StoryCategory';
import User from '@/db/models/User';
import sequelize from '@/db/sequelize';
import { EditStory, StoryForStoryPage, StoryStatus } from '@/interfaces/stories';
import { HttpError } from '@/lib/errors';
import { getSlugFromString } from '@/lib/helpers';

import StoryTagService from './StoryTagService';
import StoryCategoryService from './StoryCategoryService';
import StoryRenderService from './StoryRenderService';
import StoryRatingService from './StoryRatingService';
import PublicationNotificationEmailService, { EmailData } from './email/PublicationNotificationEmailService';

export default class StoryService {
  async saveStory(saveStoryData: EditStory, userId: number): Promise<Story> {
    const { id, tags, ...storyToSave } = saveStoryData;
    let savedStory: Story;
    let isNewStory = false;
    const transaction = await sequelize.transaction();

    if (storyToSave.status === StoryStatus.DRAFT) {
      storyToSave.submissionAgreement = false;
    }
    else if (storyToSave.status === StoryStatus.PUBLISHED) {
      storyToSave.publishedAt = new Date();
    }

    storyToSave.slug = getSlugFromString(storyToSave.title);

    const tagService = new StoryTagService();
    const tagNames = StoryTagService.convertStringToArray(tags);

    try {
      if (id) {
        savedStory = await Story.findByPk(id);

        if (savedStory.fkUser !== userId) {
          throw new HttpError('Unauthorized');
        }

        await savedStory.update(storyToSave, { transaction });
      }
      else {
        savedStory = await Story.create({
          ...storyToSave,
          fkUser: userId,
        }, { transaction });

        isNewStory = true;
      }

      const savedTags = await tagService.bulkCreate(tagNames, transaction);
      const addTagPromises = savedTags.map(tag => savedStory.$add('tag', tag, { transaction }));
      await Promise.all(addTagPromises);

      const storyCategoryService = new StoryCategoryService();
      await storyCategoryService.updateCategoriesForStory(savedStory, storyToSave.categories, transaction);

      await transaction.commit();

      if (savedStory.status === StoryStatus.PUBLISHED && isNewStory) {
        // Don't await this, we don't want to block the response
        this.sendPublicationNotificationEmail(savedStory);
      }
    }
    catch (error) {
      await transaction.rollback();
      throw error;
    }

    return savedStory;
  }

  async getStoryForEditing(storyId: number, userId: number): Promise<Story> {
    const story = await Story.findOne({
      where: {
        id: storyId,
        fkUser: userId,
      },
      include: [
        {
          model: StoryTag,
          as: 'tags',
        },
        {
          model: StoryCategory,
          as: 'categories',
        },
      ],
    });

    if (!story) {
      throw new HttpError('Not Found', 404);
    }

    return story;
  }

  async getStoryForStoryPage(slug: string, userId?: number, isPreview = false): Promise<StoryForStoryPage> {
    const storyWithStatus = await Story.findOne({
      where: { slug },
      attributes: ['status'],
    });

    if (!storyWithStatus) {
      throw new HttpError('Not Found', 404);
    }

    const shouldPreview = storyWithStatus.status !== StoryStatus.PUBLISHED && isPreview && userId;

    const story = await Story.findOne({
      where: {
        slug,
        ...!shouldPreview && { status: StoryStatus.PUBLISHED },
      },
      include: [
        {
          model: StoryComment,
          as: 'comments',
          attributes: ['id', 'comment', 'createdAt'],
          order: [['createdAt', 'DESC']],
          separate: true,
          include: [{
            model: User,
            as: 'user',
            attributes: ['username'],
          }],
        },
        {
          model: StoryTag,
          as: 'tags',
        },
        {
          model: StoryCategory,
          as: 'categories',
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
          ...shouldPreview && { where: { id: userId } },
        },
      ],
    });

    if (!story) {
      throw new HttpError('Not Found', 404);
    }

    const storyRenderService = new StoryRenderService(story.content);

    return {
      ...story.toJSON(),
      averageRating: StoryRatingService.getAverageRating(story),
      renderedStory: storyRenderService.renderStory(),
    };
  }

  async addViewToStory(storyId: number): Promise<void> {
    const story = await Story.findByPk(storyId);

    if (!story) {
      throw new HttpError('Not Found', 404);
    }

    if (story.status === StoryStatus.PUBLISHED) {
      await story.increment('views');
    }
  }

  async deleteStory(storyId: number, userId: number): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const story = await Story.findOne({
        where: {
          id: storyId,
          fkUser: userId,
        },
        include: [
          {
            model: StoryTag,
            as: 'tags',
          },
          {
            model: StoryCategory,
            as: 'categories',
          },
        ],
        transaction,
      });

      if (!story) {
        throw new HttpError('Not Found', 404);
      }

      await StoryComment.destroy({ where: { fkStory: storyId }, transaction });
      await StoryRating.destroy({ where: { fkStory: storyId }, transaction });
      await story.$remove('tags', story.tags, { transaction });
      await story.$remove('categories', story.categories, { transaction });
      await story.destroy({ transaction });
      await transaction.commit();
    }
    catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async sendPublicationNotificationEmail(story: Story): Promise<void> {
    const emailService = new PublicationNotificationEmailService();
    await emailService.sendMail<EmailData>({
      to: 'tflabs@outlook.de',
      subject: `New Story Publication: ${story.title}`,
      emailData: {
        storyTitle: story.title,
        storyLink: `${process.env.APPLICATION_HOST}/stories/${story.slug}`,
      },
    });
  }
}
