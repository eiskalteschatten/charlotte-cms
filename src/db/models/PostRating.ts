import { CreationOptional, DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, BelongsTo, Column, CreatedAt, ForeignKey, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';

import { PostRating as IPostRating } from '@/interfaces/posts';
import User from './User';
import Post from './Post';

@Table({
  tableName: 'post_ratings',
})
export default class PostRating extends Model implements IPostRating {
  @AutoIncrement
  @PrimaryKey
  @Unique(true)
  @Column({
    type: DataTypes.INTEGER,
  })
  override id: CreationOptional<number>;

  @AllowNull(false)
  @Column
  rating: number;

  @AllowNull(false)
  @ForeignKey(() => Post)
  @Column({
    field: 'fk_post',
  })
  fkPost: number;

  @BelongsTo(() => Post, 'fkPost')
  post: Post;

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
