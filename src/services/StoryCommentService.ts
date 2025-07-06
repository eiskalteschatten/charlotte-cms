import Story from '@/db/models/Story';
import StoryComment from '@/db/models/StoryComment';

import CommentNotificationEmailService, { EmailData } from './email/CommentNotificationEmailService';

export default class StoryCommentService {
  async saveComment(storyId: number, comment: string, userId: number): Promise<void> {
    await StoryComment.create({
      fkStory: storyId,
      fkUser: userId,
      comment,
    });

    // Don't await this, we don't want to block the response
    this.sendCommentNotificationEmail(storyId);
  }

  async getCommentsForUser(userId: number): Promise<StoryComment[]> {
    return StoryComment.findAll({
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

  private async sendCommentNotificationEmail(storyId: number): Promise<void> {
    const story = await Story.findByPk(storyId);

    const emailService = new CommentNotificationEmailService();
    await emailService.sendMail<EmailData>({
      to: 'tflabs@outlook.de',
      subject: `New Story Comment on ${story.title}`,
      emailData: {
        storyTitle: story.title,
        storyLink: `${process.env.APPLICATION_HOST}/stories/${story.slug}`,
      },
    });
  }
}
