import { CreationOptional, DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsTo, BelongsToMany, Column, CreatedAt, Default, ForeignKey, HasMany, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';

import { Post as IPost, PostStatus } from '@/interfaces/posts';

import User from './User';
import PostRating from './PostRating';
import PostTag from './PostTag';
import PostTagMapper from './PostTagMapper';
import PostComment from './PostComment';
import PostCategory from './PostCategory';
import PostCategoryMapper from './PostCategoryMapper';

@Table({
  tableName: 'posts',
})
export default class Post extends Model implements IPost {
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

  @AllowNull(false)
  @Default(PostStatus.DRAFT)
  @Column(DataTypes.ENUM({ values: Object.values(PostStatus) }))
  status: PostStatus;

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

  @HasMany(() => PostRating, 'fkPost')
  ratings: PostRating[];

  @BelongsToMany(() => PostCategory, () => PostCategoryMapper)
  categories: PostCategory[];

  @BelongsToMany(() => PostTag, () => PostTagMapper)
  tags: PostTag[];

  @HasMany(() => PostComment, 'fkPost')
  comments: PostComment[];

  @CreatedAt
  override createdAt: CreationOptional<Date>;

  @UpdatedAt
  override updatedAt: CreationOptional<Date>;
}
