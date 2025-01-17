/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TPasswordHistory = {
  oldPassword: string;
  changedAt: Date;
};
export type TUser = {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  passwordHistory: TPasswordHistory[];
};
export type TUserRole = keyof typeof USER_ROLE;

export interface UserModel extends Model<TUser> {
  //instance methods
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isPasswordChangedAfterJWTissued(
    passwordChangedAt: Date,
    jwtIssuedAt: number,
  ): boolean;
}
