import { CreationOptional, DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';

import Story from './Story';
import StoryCategory from './StoryCategory';

@Table({
  tableName: 'story_category_mapper',
  freezeTableName: true,
})
export default class StoryCategoryMapper extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique(true)
  @Column({
    type: DataTypes.INTEGER,
  })
  override id: CreationOptional<number>;

  @AllowNull(false)
  @ForeignKey(() => Story)
  @Column({
    field: 'fk_story',
  })
  fkStory: number;

  @BelongsTo(() => Story, 'fkStory')
  story: Story;

  @AllowNull(false)
  @ForeignKey(() => StoryCategory)
  @Column({
    field: 'fk_story_category',
  })
  fkStoryCategory: number;

  @CreatedAt
  override createdAt: CreationOptional<Date>;

  @UpdatedAt
  override updatedAt: CreationOptional<Date>;
}
