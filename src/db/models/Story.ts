import { CreationOptional, DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsTo, BelongsToMany, Column, CreatedAt, Default, ForeignKey, HasMany, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';

import { Story as IStory, StoryStatus } from '@/interfaces/stories';

import User from './User';
import StoryRating from './StoryRating';
import StoryTag from './StoryTag';
import StoryTagMapper from './StoryTagMapper';
import StoryComment from './StoryComment';
import StoryCategory from './StoryCategory';
import StoryCategoryMapper from './StoryCategoryMapper';

@Table({
  tableName: 'stories',
})
export default class Story extends Model implements IStory {
  @AutoIncrement
  @PrimaryKey
  @Unique(true)
  @Column({
    type: DataTypes.INTEGER,
  })
  override id: CreationOptional<number>;

  @AllowNull(false)
  @Column
  title: string;

  @AllowNull(false)
  @Column(DataTypes.TEXT)
  content: string;

  @AllowNull(false)
  @Column({
    field: 'short_description',
  })
  shortDescription: string;

  @AllowNull(false)
  @Default(true)
  @Column({
    field: 'open_for_comments',
  })
  openForComments: boolean;

  @AllowNull(false)
  @Default(true)
  @Column({
    field: 'open_for_ratings',
  })
  openForRatings: boolean;

  @AllowNull(true)
  @Column({
    field: 'note_to_admin',
  })
  noteToAdmin: string;

  @AllowNull(false)
  @Default(StoryStatus.DRAFT)
  @Column(DataTypes.ENUM({ values: Object.values(StoryStatus) }))
  status: StoryStatus;

  @AllowNull(false)
  @Default(false)
  @Column({
    field: 'is_erotic',
  })
  isErotic: boolean;

  @AllowNull(false)
  @Default(false)
  @Column({
    field: 'submission_agreement',
  })
  submissionAgreement: boolean;

  @AllowNull(false)
  @Unique(true)
  @Column
  slug: string;

  @AllowNull(false)
  @Default(0)
  @Column
  views: number;

  @AllowNull(true)
  @Column({
    field: 'published_at',
  })
  publishedAt: Date;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    field: 'fk_user',
  })
  fkUser: number;

  @BelongsTo(() => User, 'fkUser')
  user: User;

  @HasMany(() => StoryRating, 'fkStory')
  ratings: StoryRating[];

  @BelongsToMany(() => StoryCategory, () => StoryCategoryMapper)
  categories: StoryCategory[];

  @BelongsToMany(() => StoryTag, () => StoryTagMapper)
  tags: StoryTag[];

  @HasMany(() => StoryComment, 'fkStory')
  comments: StoryComment[];

  @CreatedAt
  override createdAt: CreationOptional<Date>;

  @UpdatedAt
  override updatedAt: CreationOptional<Date>;
}
