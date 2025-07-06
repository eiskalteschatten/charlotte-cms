import { Sequelize, Transaction } from 'sequelize';

import StoryCategory from '@/db/models/StoryCategory';
import Story from '@/db/models/Story';
import StoryCategoryMapper from '@/db/models/StoryCategoryMapper';
import { StoryCategoryWithStoryCount } from '@/interfaces/stories';

export default class StoryCategoryService {
  async getCategoriesForEditStoryPage(): Promise<StoryCategory[]> {
    return StoryCategory.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
  }

  async getCategoriesForIndexPage(): Promise<StoryCategoryWithStoryCount[]> {
    return StoryCategory.findAll({
      attributes: [
        'name',
        'slug',
        'description',
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM story_category_mapper AS mapper
          WHERE mapper.fk_story_category = \`StoryCategory\`.id
        )`), 'storyCount'],
      ],
      order: [['name', 'ASC']],
      raw: true,
    }) as unknown as Promise<StoryCategoryWithStoryCount[]>;
  }

  async getCategoryForCategoryPage(slug: string): Promise<StoryCategory> {
    return StoryCategory.findOne({
      where: { slug },
      attributes: ['id', 'slug', 'name'],
    });
  }

  async updateCategoriesForStory(story: Story, categoryIds: number[], transaction?: Transaction): Promise<void> {
    // TypeScript doesn't recognize the methods added to models by associations
    const storyCategories = await (story as any).getCategories();
    const storyCategoryIds = storyCategories.map((category: StoryCategory) => category.id);
    const categoriesToAdd = categoryIds.filter((id: number) => !storyCategoryIds.includes(id));
    const categoriesToRemove = storyCategoryIds.filter((id: number) => !categoryIds.includes(id));

    if (categoriesToAdd.length > 0) {
      await StoryCategoryMapper.bulkCreate(categoriesToAdd.map(fkStoryCategory => ({
        fkStory: story.id,
        fkStoryCategory,
      })), { transaction });
    }

    if (categoriesToRemove.length > 0) {
      await StoryCategoryMapper.destroy({
        where: {
          fkStory: story.id,
          fkStoryCategory: categoriesToRemove,
        },
        transaction,
      });
    }
  }
}
