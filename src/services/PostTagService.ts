import { Op, Sequelize, Transaction } from 'sequelize';

import PostTag from '@/db/models/PostTag';
import { getSlugFromString } from '@/lib/helpers';
import { PostTagWithPostCount } from '@/interfaces/posts';

export default class PostTagService {
  async getTagsForIndexPage(limit?: number): Promise<PostTagWithPostCount[]> {
    const tags = await PostTag.findAll({
      attributes: [
        'tag',
        'slug',
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM post_tag_mapper AS mapper
          WHERE mapper.fk_post_tag = \`PostTag\`.id
        )`), 'postCount'],
      ],
      limit,
      order: [['tag', 'ASC']],
      raw: true,
    }) as unknown as PostTagWithPostCount[];

    return tags.filter(tag => tag.postCount > 0);
  }

  async getMostPopularTagsForIndexPage(limit?: number): Promise<PostTagWithPostCount[]> {
    const tags = await PostTag.findAll({
      attributes: [
        'tag',
        'slug',
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM post_tag_mapper AS mapper
          WHERE mapper.fk_post_tag = \`PostTag\`.id
        )`), 'postCount'],
      ],
      limit,
      order: [['postCount', 'DESC']],
      raw: true,
    }) as unknown as PostTagWithPostCount[];

    return tags.filter(tag => tag.postCount > 0);
  }

  async getTagForTagPage(slug: string): Promise<PostTag> {
    return PostTag.findOne({
      where: { slug },
      attributes: ['id', 'tag'],
      raw: true,
    });
  }

  async getTagsForEditPostPage(): Promise<PostTag[]> {
    return PostTag.findAll({
      attributes: ['tag'],
      order: [['tag', 'ASC']],
    });
  }

  async bulkCreate(tags: string[], transaction?: Transaction): Promise<PostTag[]> {
    const normalizedTags = this.normalizeTags(tags);

    const existingTags = await PostTag.findAll({
      where: {
        tag: {
          [Op.in]: normalizedTags,
        },
      },
      attributes: ['tag'],
      transaction,
    });

    const existingTagNames = existingTags.map(({ tag }) => tag);
    const newTags = normalizedTags.filter(tag => !existingTagNames.includes(tag));
    const createData = newTags.map(tag => ({
      tag,
      slug: getSlugFromString(tag),
    }));

    if (createData.length > 0) {
      await PostTag.bulkCreate(createData, { transaction });
    }

    return await PostTag.findAll({
      where: {
        tag: {
          [Op.in]: normalizedTags,
        },
      },
      transaction,
    });
  }

  private normalizeTags(tags: string[]): string[] {
    return tags.map(tag => tag.trim().toLowerCase());
  }

  static convertStringToArray(tagString: string): string[] {
    return tagString.split(',').map(tag => tag.trim());
  }
}
