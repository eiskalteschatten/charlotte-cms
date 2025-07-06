import { CreationOptional, DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsToMany, Column, CreatedAt, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';

import { PostTag as IPostTag } from '@/interfaces/posts';
import Post from './Post';
import PostTagMapper from './PostTagMapper';

@Table({
  tableName: 'post_tags',
})
export default class PostTag extends Model implements IPostTag {
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

  @BelongsToMany(() => Post, () => PostTagMapper)
  posts: Post[];

  @CreatedAt
  override createdAt: CreationOptional<Date>;

  @UpdatedAt
  override updatedAt: CreationOptional<Date>;
}
