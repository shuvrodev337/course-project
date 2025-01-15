// 0 {} [] ?

import { TUser } from './user.interface';

const createUserIntoDb = async (payload: TUser) => {
  console.log(payload);
};

export const UserServices = { createUserIntoDb };
