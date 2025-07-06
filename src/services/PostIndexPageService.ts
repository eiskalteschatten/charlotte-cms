import { WhereOptions } from 'sequelize';

import Post from '@/db/models/Post';
import PostTag from '@/db/models/PostTag';
import PostComment from '@/db/models/PostComment';
import PostRating from '@/db/models/PostRating';
import PostCategory from '@/db/models/PostCategory';
import User from '@/db/models/User';
import { PostsForIndexPage, PostStatus } from '@/interfaces/posts';

import PostRatingService from './PostRatingService';

export default class PostIndexPageService {
  private readonly postIndexLimit = 20;

  private readonly indexPageIncludesForBlocks = [
    {
      model: PostComment,
      as: 'comments',
      attributes: ['id'],
    },
    {
      model: PostCategory,
      as: 'categories',
      attributes: ['id', 'name', 'slug'],
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
    },
  ];

  private async addDataForIndexPage(posts: Post[], where?: WhereOptions): Promise<PostsForIndexPage> {
    return {
      posts: posts.length > 0 ? posts.map(post => ({
        ...post.toJSON(),
        averageRating: PostRatingService.getAverageRating(post),
      })) : [],
      totalPages: await this.getTotalPages(where),
    };
  }

  private async getTotalPages(where?: WhereOptions): Promise<number> {
    const postCount = await Post.count({ where });
    return Math.ceil(postCount / this.postIndexLimit);
  }

  private getOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  async getPostsForMyPosts(userId: number, page = 1): Promise<PostsForIndexPage> {
    const where: WhereOptions = {
      fkUser: userId,
    };

    const posts = await Post.findAll({
      where,
      offset: this.getOffset(page, this.postIndexLimit),
      limit: this.postIndexLimit,
      order: [['title', 'ASC']],
      include: [
        {
          model: PostComment,
          as: 'comments',
          attributes: ['id'],
        },
        {
          model: PostCategory,
          as: 'categories',
          attributes: ['id', 'name', 'slug'],
        },
        {
          model: PostRating,
          as: 'ratings',
          attributes: ['rating'],
        },
      ],
    });

    return this.addDataForIndexPage(posts, where);
  }

  async getPublishedPostsForIndexPage(page = 1, limit = this.postIndexLimit): Promise<PostsForIndexPage> {
    const where: WhereOptions = {
      status: PostStatus.PUBLISHED,
    };

    const posts = await Post.findAll({
      where,
      offset: this.getOffset(page, limit),
      limit,
      order: [['publishedAt', 'DESC'], ['title', 'ASC']],
      include: this.indexPageIncludesForBlocks,
    });

    return this.addDataForIndexPage(posts, where);
  }

  async getMostPopularPostsForIndexPage(page = 1, limit = this.postIndexLimit): Promise<PostsForIndexPage> {
    const where: WhereOptions = {
      status: PostStatus.PUBLISHED,
    };

    const posts = await Post.findAll({
      where,
      offset: this.getOffset(page, limit),
      limit,
      order: [['views', 'DESC']],
      include: this.indexPageIncludesForBlocks,
    });

    return this.addDataForIndexPage(posts, where);
  }

  async getPublishedPostsForUserProfilePage(userId: number, page = 1): Promise<PostsForIndexPage> {
    const where: WhereOptions = {
      status: PostStatus.PUBLISHED,
      fkUser: userId,
    };

    const posts = await Post.findAll({
      where,
      offset: this.getOffset(page, this.postIndexLimit),
      limit: this.postIndexLimit,
      order: [['publishedAt', 'DESC'], ['title', 'ASC']],
      include: this.indexPageIncludesForBlocks,
    });

    return this.addDataForIndexPage(posts, where);
  }

  async getPostsForCategoryPage(categoryId: number, page = 1): Promise<PostsForIndexPage> {
    const posts = await Post.findAll({
      where: {
        status: PostStatus.PUBLISHED,
      },
      include: [
        {
          model: PostComment,
          as: 'comments',
          attributes: ['id'],
        },
        {
          model: PostCategory,
          as: 'categories',
          attributes: ['id', 'name', 'slug'],
          where: { id: categoryId },
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
        },
      ],
      offset: this.getOffset(page, this.postIndexLimit),
      limit: this.postIndexLimit,
      order: [['title', 'ASC']],
    });

    const postsWithAllCategories = [];

    for (const post of posts) {
      // TypeScript doesn't recognize the methods added to models by associations
      const postCategories = await (post as any).getCategories();

      if (postCategories.length > 0) {
        postsWithAllCategories.push({
          ...post.toJSON(),
          categories: postCategories,
          averageRating: PostRatingService.getAverageRating(post),
        });
      }
    }

    const numberOfPosts = await Post.count({
      include: [
        {
          model: PostCategory,
          as: 'categories',
          where: { id: categoryId },
          attributes: ['id'],
        },
      ],
    });

    return {
      posts: postsWithAllCategories,
      totalPages: Math.ceil(numberOfPosts / this.postIndexLimit),
    };
  }

  async getPostsForTagPage(tagId: number, page = 1): Promise<PostsForIndexPage> {
    const posts = await Post.findAll({
      where: {
        status: PostStatus.PUBLISHED,
      },
      include: [
        ...this.indexPageIncludesForBlocks,
        {
          model: PostTag,
          as: 'tags',
          where: { id: tagId },
        },
      ],
      offset: this.getOffset(page, this.postIndexLimit),
      limit: this.postIndexLimit,
      order: [['title', 'ASC']],
    });

    const numberOfPosts = await Post.count({
      include: [
        {
          model: PostTag,
          as: 'tags',
          where: { id: tagId },
          attributes: ['id'],
        },
      ],
    });

    return {
      posts: posts.map(post => ({
        ...post.toJSON(),
        averageRating: PostRatingService.getAverageRating(post),
      })),
      totalPages: Math.ceil(numberOfPosts / this.postIndexLimit),
    };
  }
}
