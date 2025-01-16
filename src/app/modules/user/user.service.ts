// 0 {} [] ?

import { TUser } from './user.interface';
import { User } from './user.model';

const getUsersFromDb = async () => {
  const result = await User.find();
  return result;
};
const getSingleUserFromDb = async (id: string) => {
  const result = await User.findById(id);
  return result;
};
const updateUserIntoDb = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

export const UserServices = {
  getUsersFromDb,
  getSingleUserFromDb,
  updateUserIntoDb,
};
