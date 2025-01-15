// 0 {} [] ?

import { TUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDb = async (payload: TUser) => {
  console.log(payload);
  payload.role = 'user';
  const result = await User.create(payload);
  return result;
};
const getUsersFromDb = async (payload: TUser) => {};

export const UserServices = { createUserIntoDb };
