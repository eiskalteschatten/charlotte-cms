import { CreationOptional, DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsToMany, Column, CreatedAt, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';

import { StoryTag as IStoryTag } from '@/interfaces/stories';
import Story from './Story';
import StoryTagMapper from './StoryTagMapper';

@Table({
  tableName: 'story_tags',
})
export default class StoryTag extends Model implements IStoryTag {
  @AutoIncrement
  @PrimaryKey
  @Unique(true)
  @Column({
    type: DataTypes.INTEGER,
  })
  override id: CreationOptional<number>;

  @AllowNull(false)
  @Unique(true)
  @Column
  tag: string;

  @AllowNull(false)
  @Unique(true)
  @Column
  slug: string;

  @BelongsToMany(() => Story, () => StoryTagMapper)
  stories: Story[];

  @CreatedAt
  override createdAt: CreationOptional<Date>;

  @UpdatedAt
  override updatedAt: CreationOptional<Date>;
}
