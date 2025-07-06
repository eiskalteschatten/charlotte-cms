import { CreationOptional, DataTypes } from 'sequelize';
import { AllowNull, AutoIncrement, Column, CreatedAt, Default, HasMany, Model, PrimaryKey, Table, Unique, UpdatedAt } from 'sequelize-typescript';

import { User as IUser, UserLinks, UserRole, UserStatus } from '@/interfaces/users';
import Post from './Post';
import PostRating from './PostRating';

@Table({
  tableName: 'users',
})
export default class User extends Model implements IUser {
  @AutoIncrement
  @PrimaryKey
  @Unique(true)
  @Column({
    type: DataTypes.INTEGER,
  })
  override id: CreationOptional<number>;

  @Unique(true)
  @AllowNull(false)
  @Column
  email: string;

  @Unique(true)
  @AllowNull(false)
  @Column
  username: string;

  @AllowNull(false)
  @Column
  password: string;

  @AllowNull(false)
  @Default(UserStatus.UNVERIFIED)
  @Column(DataTypes.ENUM({ values: Object.values(UserStatus) }))
  status: UserStatus;

  @AllowNull(false)
  @Default(UserRole.AUTHOR)
  @Column(DataTypes.ENUM({ values: Object.values(UserRole) }))
  role: UserRole;

  @AllowNull(true)
  @Column({
    field: 'verification_code',
  })
  verificationCode: string;

  @AllowNull(true)
  @Column(DataTypes.TEXT)
  bio?: string;

  @AllowNull(true)
  @Column({
    type: DataTypes.JSON,
  })
  links?: UserLinks;

  @HasMany(() => Post, 'fkUser')
  posts: Post[];

  @HasMany(() => PostRating, 'fkUser')
  ratings: PostRating[];

  @CreatedAt
  override createdAt: CreationOptional<Date>;

  @UpdatedAt
  override updatedAt: CreationOptional<Date>;
}
