import { QueryInterface, DataTypes as DataTypesNamespace } from 'sequelize';

export default {
  up: async (query: QueryInterface, DataTypes: typeof DataTypesNamespace): Promise<void> => {
    try {
      const tableDesc = await query.describeTable('post_categories');
      if (tableDesc['id']) return Promise.resolve();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (error) {
      // Silently fail because the table most likely doesn't exist and will be
      // created later
    }

    await query.createTable('post_categories', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      name: {
        type: new DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      slug: {
        type: new DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: new DataTypes.STRING,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });

    await query.createTable('post_category_mapper', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      fkPost: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_post',
        references: { model: 'posts', key: 'id' },
      },
      fkPostCategory: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_post_category',
        references: { model: 'post_categories', key: 'id' },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });

    const categories = [
      ['General', 'general', 'General posts that do not fit into other categories.'],
      ['Technology', 'technology', 'Technology-related posts.'],
      ['History', 'history', 'History-related posts.'],
      ['Gender', 'gender', 'Gender-related posts.'],
      ['Operating Systems', 'operating-systems', 'Operating System-related posts.'],
    ];

    await query.bulkInsert('post_categories', categories.map(([name, slug, description]) => ({
      name,
      slug,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    })));
  },

  down: async (query: QueryInterface): Promise<void> => {
    await query.dropTable('post_category_mapper');
    await query.dropTable('post_categories');
  },
};
