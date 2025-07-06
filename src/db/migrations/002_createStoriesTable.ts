import { QueryInterface, DataTypes as DataTypesNamespace } from 'sequelize';

export default {
  up: async (query: QueryInterface, DataTypes: typeof DataTypesNamespace): Promise<void> => {
    try {
      const storiesTable = await query.describeTable('stories');
      if (storiesTable['id']) return Promise.resolve();

      const storyRatingsTable = await query.describeTable('story_ratings');
      if (storyRatingsTable['id']) return Promise.resolve();

      const storyTagsTable = await query.describeTable('story_tags');
      if (storyTagsTable['id']) return Promise.resolve();

      const storyTagMapperTable = await query.describeTable('story_tag_mapper');
      if (storyTagMapperTable['id']) return Promise.resolve();

      const storyCommentsTable = await query.describeTable('story_comments');
      if (storyCommentsTable['id']) return Promise.resolve();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (error) {
      // Silently fail because the table most likely doesn't exist and will be
      // created later
    }

    await query.createTable('stories', {
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
      noteToAdmin: {
        type: new DataTypes.STRING,
        allowNull: true,
        field: 'note_to_admin',
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'inactive', 'archived', 'taken_down'),
        allowNull: false,
        defaultValue: 'draft',
      },
      isErotic: {
        type: new DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_erotic',
      },
      submissionAgreement: {
        type: new DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'submission_agreement',
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

    await query.createTable('story_ratings', {
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
      fkStory: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_story',
        references: { model: 'stories', key: 'id' },
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

    await query.createTable('story_tags', {
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

    await query.createTable('story_tag_mapper', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      fkStory: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_story',
        references: { model: 'stories', key: 'id' },
      },
      fkStoryTag: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_story_tag',
        references: { model: 'story_tags', key: 'id' },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });

    await query.createTable('story_comments', {
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
      fkStory: {
        type: new DataTypes.INTEGER,
        allowNull: false,
        field: 'fk_story',
        references: { model: 'stories', key: 'id' },
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
    await query.dropTable('stories');
    await query.dropTable('story_ratings');
    await query.dropTable('story_tags');
    await query.dropTable('story_tag_mapper');
    await query.dropTable('story_comments');
  },
};
