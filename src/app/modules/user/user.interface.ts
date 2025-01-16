/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';

export type TUser = {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
};

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
