import { Op, Sequelize, Transaction } from 'sequelize';

import StoryTag from '@/db/models/StoryTag';
import { getSlugFromString } from '@/lib/helpers';
import { StoryTagWithStoryCount } from '@/interfaces/stories';

export default class StoryTagService {
  async getTagsForIndexPage(limit?: number): Promise<StoryTagWithStoryCount[]> {
    const tags = await StoryTag.findAll({
      attributes: [
        'tag',
        'slug',
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM story_tag_mapper AS mapper
          WHERE mapper.fk_story_tag = \`StoryTag\`.id
        )`), 'storyCount'],
      ],
      limit,
      order: [['tag', 'ASC']],
      raw: true,
    }) as unknown as StoryTagWithStoryCount[];

    return tags.filter(tag => tag.storyCount > 0);
  }

  async getMostPopularTagsForIndexPage(limit?: number): Promise<StoryTagWithStoryCount[]> {
    const tags = await StoryTag.findAll({
      attributes: [
        'tag',
        'slug',
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM story_tag_mapper AS mapper
          WHERE mapper.fk_story_tag = \`StoryTag\`.id
        )`), 'storyCount'],
      ],
      limit,
      order: [['storyCount', 'DESC']],
      raw: true,
    }) as unknown as StoryTagWithStoryCount[];

    return tags.filter(tag => tag.storyCount > 0);
  }

  async getTagForTagPage(slug: string): Promise<StoryTag> {
    return StoryTag.findOne({
      where: { slug },
      attributes: ['id', 'tag'],
      raw: true,
    });
  }

  async getTagsForEditStoryPage(): Promise<StoryTag[]> {
    return StoryTag.findAll({
      attributes: ['tag'],
      order: [['tag', 'ASC']],
    });
  }

  async bulkCreate(tags: string[], transaction?: Transaction): Promise<StoryTag[]> {
    const normalizedTags = this.normalizeTags(tags);

    const existingTags = await StoryTag.findAll({
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
      await StoryTag.bulkCreate(createData, { transaction });
    }

    return await StoryTag.findAll({
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
