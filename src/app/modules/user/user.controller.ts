// 0 ? []  {}

import { Request, Response } from 'express';
import { UserServices } from './user.service';
import catchAsync from '../../utils/catchAsync';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { user } = req.body;
  const result = await UserServices.createUserIntoDb(user);
  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'User created successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
};
