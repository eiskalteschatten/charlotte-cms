import { CreationOptional, DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';

import { StoryComment as IStoryComment } from '@/interfaces/stories';
import User from './User';
import Story from './Story';

@Table({
  tableName: 'story_comments',
})
export default class StoryComment extends Model implements IStoryComment {
  @AutoIncrement
  @PrimaryKey
  @Unique(true)
  @Column({
    type: DataTypes.INTEGER,
  })
  override id: CreationOptional<number>;

  @AllowNull(false)
  @Column
  comment: string;

  @AllowNull(false)
  @ForeignKey(() => Story)
  @Column({
    field: 'fk_story',
  })
  fkStory: number;

  @BelongsTo(() => Story, 'fkStory')
  story: Story;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    field: 'fk_user',
  })
  fkUser: number;

  @BelongsTo(() => User, 'fkUser')
  user: User;

  @CreatedAt
  override createdAt: CreationOptional<Date>;

  @UpdatedAt
  override updatedAt: CreationOptional<Date>;
}
