import { CreationOptional, DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';

import Post from './Post';
import PostCategory from './PostCategory';

@Table({
  tableName: 'post_category_mapper',
  freezeTableName: true,
})
export default class PostCategoryMapper extends Model {
  @AutoIncrement
  @PrimaryKey
  @Unique(true)
  @Column({
    type: DataTypes.INTEGER,
  })
  override id: CreationOptional<number>;

  @AllowNull(false)
  @ForeignKey(() => Post)
  @Column({
    field: 'fk_post',
  })
  fkPost: number;

  @BelongsTo(() => Post, 'fkPost')
  post: Post;

  @AllowNull(false)
  @ForeignKey(() => PostCategory)
  @Column({
    field: 'fk_post_category',
  })
  fkPostCategory: number;

  @CreatedAt
  override createdAt: CreationOptional<Date>;

  @UpdatedAt
  override updatedAt: CreationOptional<Date>;
}
