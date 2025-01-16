// 0 ? []  {}

import { Request, Response } from 'express';
import { UserServices } from './user.service';
import catchAsync from '../../utils/catchAsync';
/*
import { verifyToken } from '../auth/auth.utils';
import config from '../../config';
*/
const getUsers = catchAsync(async (req: Request, res: Response) => {
  /*
  const token = req.headers?.authorization as string;
  console.log(token);
  const verifiedtoken = verifyToken(token, config.jwt_access_secret as string);
  console.log(verifiedtoken);
*/
  const result = await UserServices.getUsersFromDb();
  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Users retrieved successfully',
    data: result,
  });
});
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await UserServices.getSingleUserFromDb(id);
  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'User retrieved successfully',
    data: result,
  });
});
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const userData = req.body.user;
  const result = await UserServices.updateUserIntoDb(id, userData);
  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'User retrieved successfully',
    data: result,
  });
});

export const UserController = {
  getUsers,
  getSingleUser,
  updateUser,
};
