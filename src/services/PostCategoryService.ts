import { Sequelize, Transaction } from 'sequelize';

import PostCategory from '@/db/models/PostCategory';
import Post from '@/db/models/Post';
import PostCategoryMapper from '@/db/models/PostCategoryMapper';
import { PostCategoryWithPostCount } from '@/interfaces/posts';

export default class PostCategoryService {
  async getCategoriesForEditPostPage(): Promise<PostCategory[]> {
    return PostCategory.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });
  }

  async getCategoriesForIndexPage(): Promise<PostCategoryWithPostCount[]> {
    return PostCategory.findAll({
      attributes: [
        'name',
        'slug',
        'description',
        [Sequelize.literal(`(
          SELECT COUNT(*)
          FROM post_category_mapper AS mapper
          WHERE mapper.fk_post_category = \`PostCategory\`.id
        )`), 'postCount'],
      ],
      order: [['name', 'ASC']],
      raw: true,
    }) as unknown as Promise<PostCategoryWithPostCount[]>;
  }

  async getCategoryForCategoryPage(slug: string): Promise<PostCategory> {
    return PostCategory.findOne({
      where: { slug },
      attributes: ['id', 'slug', 'name'],
    });
  }

  async updateCategoriesForPost(post: Post, categoryIds: number[], transaction?: Transaction): Promise<void> {
    // TypeScript doesn't recognize the methods added to models by associations
    const postCategories = await (post as any).getCategories();
    const postCategoryIds = postCategories.map((category: PostCategory) => category.id);
    const categoriesToAdd = categoryIds.filter((id: number) => !postCategoryIds.includes(id));
    const categoriesToRemove = postCategoryIds.filter((id: number) => !categoryIds.includes(id));

    if (categoriesToAdd.length > 0) {
      await PostCategoryMapper.bulkCreate(categoriesToAdd.map(fkPostCategory => ({
        fkPost: post.id,
        fkPostCategory,
      })), { transaction });
    }

    if (categoriesToRemove.length > 0) {
      await PostCategoryMapper.destroy({
        where: {
          fkPost: post.id,
          fkPostCategory: categoriesToRemove,
        },
        transaction,
      });
    }
  }
}
