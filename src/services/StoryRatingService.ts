import StoryRating from '@/db/models/PostRating';
import Story from '@/db/models/Post';

import RatingNotificationEmailService, { EmailData } from './email/RatingNotificationEmailService';

export default class StoryRatingService {
  async addRatingToStory(storyId: number, rating: number, userId: number): Promise<number> {
    await StoryRating.create({
      fkStory: storyId,
      fkUser: userId,
      rating,
    });

    const story = await Story.findByPk(storyId, {
      include: [
        {
          model: StoryRating,
          as: 'ratings',
        },
      ],
    });

    // Don't await this, we don't want to block the response
    this.sendRatingNotificationEmail(story);

    return StoryRatingService.getAverageRating(story);
  }

  static getAverageRating(story: Story): number {
    if (!story.ratings?.length) {
      return 0;
    }

    const total = story.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return Number((total / story.ratings.length).toFixed(2));
  }

  async getRatingsForUser(userId: number): Promise<StoryRating[]> {
    return StoryRating.findAll({
      where: {
        fkUser: userId,
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Story,
          as: 'story',
          attributes: ['title', 'slug'],
        },
      ],
    });
  }

  private async sendRatingNotificationEmail(story: Story): Promise<void> {
    const emailService = new RatingNotificationEmailService();
    await emailService.sendMail<EmailData>({
      to: 'tflabs@outlook.de',
      subject: `New Story Rating on ${story.title}`,
      emailData: {
        storyTitle: story.title,
        storyLink: `${process.env.APPLICATION_HOST}/stories/${story.slug}`,
      },
    });
  }
}
