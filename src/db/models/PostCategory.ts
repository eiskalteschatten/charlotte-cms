import { CreationOptional, DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsToMany, Column, CreatedAt, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';

import { PostCategory as IPostCategory } from '@/interfaces/posts';
import Post from './Post';
import PostCategoryMapper from './PostCategoryMapper';

@Table({
  tableName: 'post_categories',
})
export default class PostCategory extends Model implements IPostCategory {
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

  @BelongsToMany(() => Post, () => PostCategoryMapper)
  posts: Post[];

  @CreatedAt
  override createdAt: CreationOptional<Date>;

  @UpdatedAt
  override updatedAt: CreationOptional<Date>;
}
