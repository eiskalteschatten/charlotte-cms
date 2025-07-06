import { QueryInterface, DataTypes as DataTypesNamespace } from 'sequelize';

export default {
  up: async (query: QueryInterface, DataTypes: typeof DataTypesNamespace): Promise<void> => {
    try {
      const tableDesc = await query.describeTable('users');
      if (tableDesc['id']) return Promise.resolve();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (error) {
      // Silently fail because the table most likely doesn't exist and will be
      // created later
    }

    await query.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      email: {
        type: new DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: new DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'disabled', 'unverified'),
        allowNull: false,
        defaultValue: 'unverified',
      },
      role: {
        type: DataTypes.ENUM('author', 'moderator', 'super_admin'),
        allowNull: false,
        defaultValue: 'author',
      },
      verificationCode: {
        type: new DataTypes.STRING,
        field: 'verification_code',
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      links: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    });
  },

  down: async (query: QueryInterface): Promise<void> => {
    await query.dropTable('users');
  },
};
