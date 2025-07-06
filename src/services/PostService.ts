import Post from '@/db/models/Post';
import PostTag from '@/db/models/PostTag';
import PostComment from '@/db/models/PostComment';
import PostRating from '@/db/models/PostRating';
import PostCategory from '@/db/models/PostCategory';
import User from '@/db/models/User';
import sequelize from '@/db/sequelize';
import { EditPost, PostForPostPage, PostStatus } from '@/interfaces/posts';
import { HttpError } from '@/lib/errors';
import { getSlugFromString } from '@/lib/helpers';

import PostTagService from './PostTagService';
import PostCategoryService from './PostCategoryService';
import PostRenderService from './PostRenderService';
import PostRatingService from './PostRatingService';
import PublicationNotificationEmailService, { EmailData } from './email/PublicationNotificationEmailService';

export default class PostService {
  async savePost(savePostData: EditPost, userId: number): Promise<Post> {
    const { id, tags, ...postToSave } = savePostData;
    let savedPost: Post;
    let isNewPost = false;
    const transaction = await sequelize.transaction();

    if (postToSave.status === PostStatus.PUBLISHED) {
      postToSave.publishedAt = new Date();
    }

    postToSave.slug = getSlugFromString(postToSave.title);

    const tagService = new PostTagService();
    const tagNames = PostTagService.convertStringToArray(tags);

    try {
      if (id) {
        savedPost = await Post.findByPk(id);

        if (savedPost.fkUser !== userId) {
          throw new HttpError('Unauthorized');
        }

        await savedPost.update(postToSave, { transaction });
      }
      else {
        savedPost = await Post.create({
          ...postToSave,
          fkUser: userId,
        }, { transaction });

        isNewPost = true;
      }

      const savedTags = await tagService.bulkCreate(tagNames, transaction);
      const addTagPromises = savedTags.map(tag => savedPost.$add('tag', tag, { transaction }));
      await Promise.all(addTagPromises);

      const postCategoryService = new PostCategoryService();
      await postCategoryService.updateCategoriesForPost(savedPost, postToSave.categories, transaction);

      await transaction.commit();

      if (savedPost.status === PostStatus.PUBLISHED && isNewPost) {
        // Don't await this, we don't want to block the response
        this.sendPublicationNotificationEmail(savedPost);
      }
    }
    catch (error) {
      await transaction.rollback();
      throw error;
    }

    return savedPost;
  }

  async getPostForEditing(postId: number, userId: number): Promise<Post> {
    const post = await Post.findOne({
      where: {
        id: postId,
        fkUser: userId,
      },
      include: [
        {
          model: PostTag,
          as: 'tags',
        },
        {
          model: PostCategory,
          as: 'categories',
        },
      ],
    });

    if (!post) {
      throw new HttpError('Not Found', 404);
    }

    return post;
  }

  async getPostForPostPage(slug: string, userId?: number, isPreview = false): Promise<PostForPostPage> {
    const postWithStatus = await Post.findOne({
      where: { slug },
      attributes: ['status'],
    });

    if (!postWithStatus) {
      throw new HttpError('Not Found', 404);
    }

    const shouldPreview = postWithStatus.status !== PostStatus.PUBLISHED && isPreview && userId;

    const post = await Post.findOne({
      where: {
        slug,
        ...!shouldPreview && { status: PostStatus.PUBLISHED },
      },
      include: [
        {
          model: PostComment,
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
          model: PostTag,
          as: 'tags',
        },
        {
          model: PostCategory,
          as: 'categories',
        },
        {
          model: PostRating,
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

    if (!post) {
      throw new HttpError('Not Found', 404);
    }

    const postRenderService = new PostRenderService(post.content);

    return {
      ...post.toJSON(),
      averageRating: PostRatingService.getAverageRating(post),
      renderedPost: postRenderService.renderPost(),
    };
  }

  async addViewToPost(postId: number): Promise<void> {
    const post = await Post.findByPk(postId);

    if (!post) {
      throw new HttpError('Not Found', 404);
    }

    if (post.status === PostStatus.PUBLISHED) {
      await post.increment('views');
    }
  }

  async deletePost(postId: number, userId: number): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      const post = await Post.findOne({
        where: {
          id: postId,
          fkUser: userId,
        },
        include: [
          {
            model: PostTag,
            as: 'tags',
          },
          {
            model: PostCategory,
            as: 'categories',
          },
        ],
        transaction,
      });

      if (!post) {
        throw new HttpError('Not Found', 404);
      }

      await PostComment.destroy({ where: { fkPost: postId }, transaction });
      await PostRating.destroy({ where: { fkPost: postId }, transaction });
      await post.$remove('tags', post.tags, { transaction });
      await post.$remove('categories', post.categories, { transaction });
      await post.destroy({ transaction });
      await transaction.commit();
    }
    catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private async sendPublicationNotificationEmail(post: Post): Promise<void> {
    const emailService = new PublicationNotificationEmailService();
    await emailService.sendMail<EmailData>({
      to: 'tflabs@outlook.de',
      subject: `New Post Publication: ${post.title}`,
      emailData: {
        postTitle: post.title,
        postLink: `${process.env.APPLICATION_HOST}/posts/${post.slug}`,
      },
    });
  }
}
