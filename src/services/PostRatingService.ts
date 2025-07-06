import PostRating from '@/db/models/PostRating';
import Post from '@/db/models/Post';

import RatingNotificationEmailService, { EmailData } from './email/RatingNotificationEmailService';

export default class PostRatingService {
  async addRatingToPost(postId: number, rating: number, userId: number): Promise<number> {
    await PostRating.create({
      fkPost: postId,
      fkUser: userId,
      rating,
    });

    const post = await Post.findByPk(postId, {
      include: [
        {
          model: PostRating,
          as: 'ratings',
        },
      ],
    });

    // Don't await this, we don't want to block the response
    this.sendRatingNotificationEmail(post);

    return PostRatingService.getAverageRating(post);
  }

  static getAverageRating(post: Post): number {
    if (!post.ratings?.length) {
      return 0;
    }

    const total = post.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return Number((total / post.ratings.length).toFixed(2));
  }

  async getRatingsForUser(userId: number): Promise<PostRating[]> {
    return PostRating.findAll({
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

  private async sendRatingNotificationEmail(post: Post): Promise<void> {
    const emailService = new RatingNotificationEmailService();
    await emailService.sendMail<EmailData>({
      to: 'tflabs@outlook.de',
      subject: `New Post Rating on ${post.title}`,
      emailData: {
        postTitle: post.title,
        postLink: `${process.env.APPLICATION_HOST}/posts/${post.slug}`,
      },
    });
  }
}
