import { CreationOptional, DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';

import Story from './Story';
import StoryTag from './StoryTag';

@Table({
  tableName: 'story_tag_mapper',
  freezeTableName: true,
})
export default class StoryTagMapper extends Model {
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
  @ForeignKey(() => StoryTag)
  @Column({
    field: 'fk_story_tag',
  })
  fkStoryTag: number;

  @CreatedAt
  override createdAt: CreationOptional<Date>;

  @UpdatedAt
  override updatedAt: CreationOptional<Date>;
}
