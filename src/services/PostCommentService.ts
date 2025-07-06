import Post from '@/db/models/Post';
import PostComment from '@/db/models/PostComment';

import CommentNotificationEmailService, { EmailData } from './email/CommentNotificationEmailService';

export default class PostCommentService {
  async saveComment(postId: number, comment: string, userId: number): Promise<void> {
    await PostComment.create({
      fkPost: postId,
      fkUser: userId,
      comment,
    });

    // Don't await this, we don't want to block the response
    this.sendCommentNotificationEmail(postId);
  }

  async getCommentsForUser(userId: number): Promise<PostComment[]> {
    return PostComment.findAll({
      where: {
        fkUser: userId,
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Post,
          as: 'post',
          attributes: ['title', 'slug'],
        },
      ],
    });
  }

  private async sendCommentNotificationEmail(postId: number): Promise<void> {
    const post = await Post.findByPk(postId);

    const emailService = new CommentNotificationEmailService();
    await emailService.sendMail<EmailData>({
      to: 'tflabs@outlook.de',
      subject: `New Post Comment on ${post.title}`,
      emailData: {
        postTitle: post.title,
        postLink: `${process.env.APPLICATION_HOST}/posts/${post.slug}`,
      },
    });
  }
}
