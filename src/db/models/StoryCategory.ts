import { CreationOptional, DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsToMany, Column, CreatedAt, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';

import { StoryCategory as IStoryCategory } from '@/interfaces/stories';
import Story from './Story';
import StoryCategoryMapper from './StoryCategoryMapper';

@Table({
  tableName: 'story_categories',
})
export default class StoryCategory extends Model implements IStoryCategory {
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
  name: string;

  @AllowNull(false)
  @Unique(true)
  @Column
  slug: string;

  @Column
  description: string;

  @BelongsToMany(() => Story, () => StoryCategoryMapper)
  stories: Story[];

  @CreatedAt
  override createdAt: CreationOptional<Date>;

  @UpdatedAt
  override updatedAt: CreationOptional<Date>;
}
