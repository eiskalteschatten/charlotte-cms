import { QueryInterface, DataTypes as DataTypesNamespace } from 'sequelize';

export default {
  up: async (query: QueryInterface, DataTypes: typeof DataTypesNamespace): Promise<void> => {
    try {
      const postsTable = await query.describeTable('posts');
      if (postsTable['id']) return Promise.resolve();

      const postRatingsTable = await query.describeTable('post_ratings');
      if (postRatingsTable['id']) return Promise.resolve();

      const postTagsTable = await query.describeTable('post_tags');
      if (postTagsTable['id']) return Promise.resolve();

      const postTagMapperTable = await query.describeTable('post_tag_mapper');
      if (postTagMapperTable['id']) return Promise.resolve();

      const postCommentsTable = await query.describeTable('post_comments');
      if (postCommentsTable['id']) return Promise.resolve();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (error) {
      // Silently fail because the table most likely doesn't exist and will be
      // created later
    }

    await query.createTable('posts', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      title: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: new DataTypes.TEXT,
        allowNull: false,
      },
      shortDescription: {
        type: new DataTypes.STRING,
        allowNull: false,
        field: 'short_description',
      },
      openForComments: {
        type: new DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'open_for_comments',
      },
      openForRatings: {
        type: new DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'open_for_ratings',
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'inactive', 'archived'),
        allowNull: false,
        defaultValue: 'draft',
      },
      slug: {
        type: new DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      views: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      publishedAt: {
        type: new DataTypes.DATE,
        allowNull: true,
        field: 'published_at',
      },
      fkUser: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_user',
        references: { model: 'users', key: 'id' },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });

    await query.createTable('post_ratings', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      rating: {
        type: new DataTypes.INTEGER,
        allowNull: false,
      },
      fkPost: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_post',
        references: { model: 'posts', key: 'id' },
      },
      fkUser: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_user',
        references: { model: 'users', key: 'id' },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });

    await query.createTable('post_tags', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      tag: {
        type: new DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      slug: {
        type: new DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });

    await query.createTable('post_tag_mapper', {
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
      fkPostTag: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_post_tag',
        references: { model: 'post_tags', key: 'id' },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });

    await query.createTable('post_comments', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      comment: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
      fkPost: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_post',
        references: { model: 'posts', key: 'id' },
      },
      fkUser: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_user',
        references: { model: 'users', key: 'id' },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
  },

  down: async (query: QueryInterface): Promise<void> => {
    await query.dropTable('posts');
    await query.dropTable('post_ratings');
    await query.dropTable('post_tags');
    await query.dropTable('post_tag_mapper');
    await query.dropTable('post_comments');
  },
};
